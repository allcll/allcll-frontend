import {ButtonHTMLAttributes} from "react";


function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={"flex justify-between items-center gap-x-2 rounded " + props.className}/>;
}

export default Button;