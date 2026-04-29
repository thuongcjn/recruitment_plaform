import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2 } from 'lucide-react';

const SortableItem = ({ id, index, children, onRemove, title }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative group bg-white border rounded-xl mb-4 transition-all ${
            snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500 z-50' : 'shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-start">
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="p-3 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 p-4 pl-0">
              {title && <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">{title}</h4>}
              {children}
            </div>

            {/* Actions */}
            <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onRemove}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Xóa mục này"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default SortableItem;
