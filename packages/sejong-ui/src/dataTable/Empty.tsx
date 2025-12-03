function Empty() {
  return (
    <tbody>
      <tr>
        <td colSpan={99} className="text-gray-500 py-4">
          <div className="min-h-[160px] flex items-center justify-center ">
            <p className="bg-gray-100 px-15 py-1 border">조회된 내역이 없습니다.</p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default Empty;
