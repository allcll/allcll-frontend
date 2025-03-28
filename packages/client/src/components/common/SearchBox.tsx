import {InputHTMLAttributes} from "react";
import DeleteSVG from "@/assets/x-gray.svg?react";
import SearchSvg from '@/assets/search.svg?react';


interface ISearchBox extends InputHTMLAttributes<HTMLInputElement> {
  onDelete: () => void;
}

function SearchBox({onDelete, ...props}: ISearchBox) {
  return (
    <div className="relative flex items-center w-full">
      <SearchSvg className="absolute left-3 top-3 text-gray-500"/>
      <input type="text" className={"pl-10 pr-6 py-2 rounded-md w-full bg-white border border-gray-400 " + (props.className ?? '')} {...props}/>
      <button className="absolute right-2 top-0 bottom-0 cursor-pointer" aria-label='입력 내용 삭제' onClick={onDelete}>
        <DeleteSVG className="w-3 h-3"/>
      </button>
    </div>
  );
}

export default SearchBox;