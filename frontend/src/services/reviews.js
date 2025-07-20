import api from './api';

// Fetch all approved reviews
export const getReviews = async () => {
    const { data } = await api.get('/reviews');
    return data;
};

// Submit a new review
export const submitReview = async (reviewData) => {
    const { data } = await api.post('/reviews', reviewData);
    return data;
};