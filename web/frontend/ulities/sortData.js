export const sortData = (arr = [], sortBy) => {
  switch (sortBy) {
    case "az": {
      arr.sort((a, b) => {
        if (a.title >= b.title) return 1;
        else return -1;
      });
      break;
    }

    case "za": {
      arr.sort((a, b) => {
        if (a.title >= b.title) return -1;
        else return 1;
      });
      break;
    }

    case "oldest": {
      arr.sort((a, b) => {
        if (a.updated_at >= b.updated_at) return -1;
        else return 1;
      });
      break;
    }

    case "newest": {
      arr.sort((a, b) => {
        if (a.updated_at >= b.updated_at) return 1;
        else return 1;
      });
      break;
    }
  }

  return arr;
};
