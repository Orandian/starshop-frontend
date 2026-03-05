import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationComponent = ({ currentPage, totalPages, onPageChange }: Props) => {
  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1); // Always show first page

    if (left > 2) {
      range.push("left-ellipsis");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("right-ellipsis");
    }

    if (totalPages > 1) {
      range.push(totalPages); // Always show last page
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className="cursor-pointer"
          />
        </PaginationItem>

        {/* Page Numbers + Ellipsis */}
        {paginationRange.map((item) => {
          if (item === "left-ellipsis" || item === "right-ellipsis") {
            return (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof item === "number") onPageChange(item);
                }}
                className="cursor-pointer border-black/20"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className="cursor-pointer"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
