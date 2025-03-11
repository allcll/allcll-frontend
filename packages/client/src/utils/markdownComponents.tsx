const markdownComponents = {
  h2: (props: any) => <h2 {...props} className="text-lg font-bold my-4"/>,
  h3: (props: any) => <h3 {...props} className="text-base font-bold my-4"/>,
  a: (props: any) => <a {...props} className="text-blue-500 underline" />,
}

export default markdownComponents;