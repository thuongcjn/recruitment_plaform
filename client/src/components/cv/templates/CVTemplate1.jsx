import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const CVTemplate1 = ({ data }) => {
  const { personalInfo, experience, education, skills, bio } = data;

  return (
    <div
      id="cv-preview-content"
      className="bg-white w-[210mm] p-[20mm] mx-auto text-slate-800"
      style={{ minHeight: '297mm', wordBreak: 'break-word', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Header */}
      <header className="border-b-[3px] border-slate-900 pb-8 mb-10">
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tight leading-tight text-slate-900">
          {personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-900 shrink-0" />
            <span>{personalInfo.email}</span>
          </div>
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-900 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-900 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-10">
        {/* Bio */}
        {bio && (
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Tóm tắt chuyên môn</h3>
            <p className="text-[15px] leading-relaxed text-slate-700">{bio}</p>
          </section>
        )}

        {/* Experience */}
        <section>
          <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 border-b border-slate-100 pb-2">Kinh nghiệm làm việc</h2>
          <div className="flex flex-col gap-8">
            {experience.map((exp, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">{exp.position}</h4>
                  <span className="text-[12px] font-bold text-slate-500 uppercase">{exp.duration}</span>
                </div>
                <p className="text-[15px] font-bold text-slate-600 mb-2">{exp.company}</p>
                <div className="text-[14px] text-slate-600 whitespace-pre-wrap leading-relaxed">{exp.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 border-b border-slate-100 pb-2">Học vấn</h2>
          <div className="flex flex-col gap-6">
            {education.map((edu, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">{edu.school}</h4>
                  <span className="text-[12px] font-bold text-slate-500 uppercase">{edu.year}</span>
                </div>
                <p className="text-[14px] font-medium text-slate-600 uppercase tracking-wide">{edu.degree}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-900 mb-4 border-b border-slate-100 pb-2">Kỹ năng chuyên môn</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-[14px] font-bold text-slate-700">{skill}</span>
                {index < skills.length - 1 && <span className="h-1 w-1 rounded-full bg-slate-300"></span>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CVTemplate1;
