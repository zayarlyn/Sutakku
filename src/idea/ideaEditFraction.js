import { useState } from "react";
import Iconify from "../utility/Iconify";

const btnStyle =
  "font-normal text-[13px] tracking-wide underline underline-offset-1 px-2 rounded-sm ";

const options = [
  { color: "bg-green-700", level: "trivial", selected: false },
  { color: "bg-blue-700", level: "moderate", selected: false },
  { color: "bg-red-700", level: "urgent", selected: false },
];

function IdeaEditFraction({ file, line, Location }) {
  const [selected, setSelected] = useState("");

  return (
    <>
      <div className="font-exo flex justify-between items-center mt-5 mb-[5px]">
        <div className="flex gap-3 items">
          {options.map((option) => {
            return (
              <button
                key={option.level}
                id={option.level}
                onClick={(e) => setSelected(option.level)}
                className={btnStyle + (selected === option.level ? option.color : "")}
              >
                {option.level}
              </button>
            );
          })}
        </div>
        <div className="group flex gap-4">
          <button className="-mt-1 opacity-0 group-hover:opacity-100">
            <Iconify data-width={13} data-icon="fa6-solid:pencil" />
          </button>
          <Location file={file} line={line} />
        </div>
      </div>
      <hr />
      <div className="font-light text-[13px] flex justify-end gap-5 mt-1">
        <p>
          last modified: <span className="font-normal">3 min ago</span>
        </p>
        <p>
          created at: <span className="font-normal">12/27/2021</span>
        </p>
      </div>
    </>
  );
}

export default IdeaEditFraction;
