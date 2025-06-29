import React, { useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

export interface CollumnDefinition {
  name: string;
  sortable: boolean;
  icon?: React.ReactNode;
  initialSortDirection?: "asc" | "desc";
}

interface SimpleTableProps {
  columns: CollumnDefinition[];
  rows: React.ReactNode[][];
  onSort?: (columnIndex: number, direction: "asc" | "desc") => void;
}

export default function SimpleTable({
  columns,
  rows,
  onSort,
}: SimpleTableProps) {

  const [activeSort, setActiveSort] = useState<{
    columnIndex: number;
    direction: "asc" | "desc";
  }>(() => {
    let initialIndex = columns.findIndex((col) => typeof col.initialSortDirection !== "undefined");

    if (initialIndex === -1) {
      initialIndex = columns.findIndex((col) => col.sortable);
    }

    return initialIndex !== -1
      ? { columnIndex: initialIndex, direction: columns[initialIndex].initialSortDirection || "asc" }
      : { columnIndex: -1, direction: "asc" };
  });

  const handleSortClick = (index: number) => {
    if (!columns[index].sortable) return;

    let newDirection: "asc" | "desc" = "asc";
    if (activeSort.columnIndex === index) {
      newDirection = activeSort.direction === "asc" ? "desc" : "asc";
    }
    
    setActiveSort({ columnIndex: index, direction: newDirection });
    if (onSort) onSort(index, newDirection);
  }

  return (
      <Table 
        theme={
        {
          head: {
            cell: {
              base: "bg-gray-200 dark:bg-gray-700 px-6 py-3 text-gray-700 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg border-1"
            }
          }
        }
      }>
        <TableHead>
            {columns.map((col, index) => (
              <TableHeadCell
                key={index}
                className="cursor-pointer text-center text-md"
                onClick={() => handleSortClick(index)}
              >
                <div className="flex items-center justify-center gap-2">
                  {col.icon && <span className="mr-1 text-lg">{col.icon}</span>}
                  <span>{col.name}</span>
                  {col.sortable && (
                    <>
                      {activeSort.columnIndex === index ? (
                        activeSort.direction === "asc" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </>
                  )}
                </div>
              </TableHeadCell>
            ))}
        </TableHead>

        <TableBody className="divide-y">
          {rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {row.map((cell, cellIndex) => {
                // const column = columns[cellIndex];
                // const justifyContent = column.center ? "ml-10 justify-start" : "justify-start";

                return (
                  <TableCell
                    key={cellIndex}
                    className="text-md whitespace-nowrap font-medium text-gray-900 dark:text-white text-center"
                  >
                    <div className={`flex items-center justify-center`}>{cell}</div>
                  </TableCell>
                );
            })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}
