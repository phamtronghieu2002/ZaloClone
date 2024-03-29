import axios from './axios';
export const getMessageByConversationId = (conversationId) => {
    return axios.get('/message/' + conversationId);
};
export const sendMessage = (data) => {
    return axios.post('/message', data);
};

export const updateStatus = (senderId, conversationId, receiverId) => {
    console.log(senderId, conversationId, receiverId);
    return axios.post('/message/updateStatus', { senderId, conversationId, receiverId });
};

export const updateLastMessage = (conversationId, content, senderid) => {
    return axios.put(`/conversation/${conversationId}?lastMessage=${content}&senderid=${senderid}`);
}