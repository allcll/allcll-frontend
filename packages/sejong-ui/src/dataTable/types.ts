import React from 'react';

export interface ColumnDefinition<T> {
  /**
   * 테이블 헤더에 표시될 텍스트입니다.
   */
  header: string;
  /**
   * 셀을 렌더링하는 함수입니다.
   * 예시: (row) => <span>{row.name}</span>
   * @param row 현재 행의 데이터 객체
   */
  cell: (row: T, index: number) => React.ReactNode;
}
