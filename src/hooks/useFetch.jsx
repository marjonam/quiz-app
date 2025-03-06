import { useEffect, useReducer } from "react";

const initialState = {
  data: null,
  isPending: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, isPending: true, error: null };
    case "SUCCESS":
      return { data: action.payload, isPending: false, error: null };
    case "ERROR":
      return { data: null, isPending: false, error: action.payload };
    default:
      return state;
  }
};

export function useFetch(url) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;
    dispatch({ type: "LOADING" });

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          dispatch({ type: "SUCCESS", payload: data });
        }
      })
      .catch((error) => {
        if (isMounted) {
          dispatch({ type: "ERROR", payload: error.message });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
}
