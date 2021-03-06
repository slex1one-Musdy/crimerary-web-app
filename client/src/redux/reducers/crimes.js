import * as types from "../actions/actionTypes";

const initialState = {
  crimes: [],
  crime: null,
  loading: true,
  similarCrimes: [],
};

const crime = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case types.CREATE_CRIME:
      return {
        ...state,
        crimes: [...state.crimes, payload],
        loading: false,
      };

    case types.GET_CRIME:
      return {
        ...state,
        crime: { ...state.crime, ...payload },
        loading: false,
      };

    case types.SIMILAR_CRIMES:
      return {
        ...state,
        similarCrimes: payload,
        loading: false,
      };

    case types.GET_CRIMES:
      return {
        ...state,
        crimes: payload,
        loading: false,
      };

    case types.EDIT_CRIME:
      return {
        ...state,
        crime: { ...state.crime, ...payload },
        // crimes: state.crimes.map((crime) => {
        //   if (crime._id === payload.id) {
        //     const newCrime = payload.crime;
        //     let updatedCrime = { ...crime, ...newCrime };
        //     return updatedCrime;
        //   } else {
        //     return crime;
        //   }
        // }),
        loading: false,
      };

    case types.ERROR_CRIME:
      return {
        ...state,
        crime: null,
        crimes: [],
        loading: false,
      };

    case types.REMOVE_CRIME:
      return {
        ...state,
        crime: {
          ...state.crime,
        },
        crimes: state.crimes.filter((crime) => crime._id !== payload.crimeID),
        loading: false,
      };

    default:
      return state;
  }
};

export default crime;
