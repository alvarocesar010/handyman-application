"use client";

import { Save, X, SquarePenIcon } from "lucide-react";

type Props = {
  editing: boolean;
  loading?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function ActionButtons({
  editing,
  loading = false,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="flex justify-end gap-2">
      {!editing ? (
        <button
          onClick={onEdit}
          className="
            flex items-center gap-2
            px-3 py-2 rounded-md
            border border-slate-300
            bg-white text-slate-700
            hover:bg-slate-100
            transition
          "
        >
          <SquarePenIcon size={16} />
          <span className="text-sm font-medium">Edit</span>
        </button>
      ) : (
        <>
          <button
            onClick={onSave}
            disabled={loading}
            className="
              flex items-center gap-2
              px-3 py-2 rounded-md
              bg-emerald-600 text-white
              hover:bg-emerald-700
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <span className="text-sm">Saving...</span>
            ) : (
              <>
                <Save size={16} />
                <span className="text-sm font-medium">Save</span>
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            className="
              flex items-center gap-2
              px-3 py-2 rounded-md
              border border-rose-300
              bg-white text-rose-600
              hover:bg-rose-50
              transition
            "
          >
            <X size={16} />
            <span className="text-sm font-medium">Cancel</span>
          </button>
        </>
      )}
    </div>
  );
}
