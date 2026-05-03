const { GoogleGenerativeAI } = require("@google/generative-ai");
const Job = require("../models/Job");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Tool 1: Create Job (For Recruiters)
const createJobTool = {
  name: "create_job_posting",
  parameters: {
    type: "OBJECT",
    description: "Create a new job listing on the platform",
    properties: {
      title: { type: "STRING" },
      description: { type: "STRING" },
      type: { type: "STRING", enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"] },
      location: { type: "STRING" },
      category: { type: "STRING", enum: ["IT & Software", "Marketing", "Design", "Finance", "Human Resources", "Others"] },
      salaryRange: { type: "STRING" },
      requirements: { type: "ARRAY", items: { type: "STRING" } },
      benefits: { type: "ARRAY", items: { type: "STRING" } },
    },
    required: ["title", "description", "type", "location", "category"],
  },
};

// Tool 2: Search Jobs (For Candidates)
const searchJobsTool = {
  name: "search_jobs",
  parameters: {
    type: "OBJECT",
    description: "Search for available job listings based on criteria",
    properties: {
      keyword: { type: "STRING", description: "Job title or skill keyword" },
      location: { type: "STRING", description: "City or province" },
      category: { type: "STRING", description: "Job category" },
    },
  },
};

exports.chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // Use stable version
      tools: [{ functionDeclarations: [createJobTool, searchJobsTool] }],
      systemInstruction: `Bạn là trợ lý Hiretify.
      - Recruiter: Có thể dùng 'create_job_posting' để đăng tin.
      - Candidate: Có thể dùng 'search_jobs' để tìm việc.
      - Nếu tìm thấy việc, hãy liệt kê tóm tắt và gửi kèm link (giả định link là /jobs/[id]).
      - Luôn trả lời bằng tiếng Việt.`,
    });

    // History Validation
    let validatedHistory = (history || []).filter(h => h.role === 'user' || h.role === 'model');
    if (validatedHistory.length > 0 && validatedHistory[0].role === 'model') {
      validatedHistory.shift();
    }

    const chat = model.startChat({
      history: validatedHistory,
      generationConfig: { maxOutputTokens: 1000 },
    });

    let result = await chat.sendMessage(message);
    let response = result.response;

    // Check for function calls
    const call = response.functionCalls() ? response.functionCalls()[0] : null;

    if (call) {
      if (call.name === "create_job_posting") {
        if (userRole !== "recruiter") {
          return res.json({ text: "Chỉ nhà tuyển dụng mới có thể đăng tin." });
        }
        const newJob = await Job.create({ ...call.args, company: userId });
        const toolResponse = await chat.sendMessage([{
          functionResponse: { name: "create_job_posting", response: { success: true, jobId: newJob._id } }
        }]);
        return res.json({ text: toolResponse.response.text(), jobCreated: true });
      }

      if (call.name === "search_jobs") {
        const { keyword, location, category } = call.args;
        let query = { status: 'open' };
        if (keyword) query.$or = [{ title: { $regex: keyword, $options: 'i' } }, { description: { $regex: keyword, $options: 'i' } }];
        if (location) query.location = { $regex: location, $options: 'i' };
        if (category) query.category = category;

        const jobs = await Job.find(query).limit(5).populate('company', 'fullName');
        const toolResponse = await chat.sendMessage([{
          functionResponse: {
            name: "search_jobs",
            response: { results: jobs.map(j => ({ id: j._id, title: j.title, company: j.company.fullName, location: j.location })) }
          }
        }]);
        return res.json({ text: toolResponse.response.text() });
      }
    }

    // Tránh gửi tin nhắn trống
    const replyText = response.text();
    if (!replyText) {
      return res.json({ text: "Tôi có thể giúp gì thêm cho bạn không?" });
    }

    res.json({ text: replyText });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ text: "Hệ thống AI đang bận, bạn thử lại sau nhé." });
  }
};
