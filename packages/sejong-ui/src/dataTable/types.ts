import React from 'react';

export interface ColumnDefinition<T> {
  /**
   * 테이블 헤더에 표시될 텍스트입니다.
   */
  header: string;

  /**
   * 데이터 객체에서 값을 가져올 키를 지정합니다.
   * `cell` 함수가 정의되면 이 값은 무시될 수 있습니다.
   */
  accessorKey: keyof T;

  /**
   * 셀(<td>)을 직접 렌더링하는 함수입니다.
   * 버튼, 이미지, 포맷팅된 텍스트 등 커스텀 UI를 구현할 때 사용합니다.
   * @param row 현재 행의 데이터 객체
   */
  cell?: (row: T) => React.ReactNode;
}
