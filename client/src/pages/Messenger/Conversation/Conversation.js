import './Conversation.scss';
import Search from '../../../components/Search/Search';
import clsx from 'clsx';
import ConversationItem from './ConversationItem/ConversationItem';
import * as conversationService from '../../../services/conversationService';
import * as messageService from '../../../services/messageService';
import { useEffect, useState, useContext, useRef } from 'react';
import { socketContext } from '../../../providers/Socket/SocketProvider';
import { ConversationContext } from '../../../providers/ConversationProvider/ConversationProvider';

const Conversation = () => {
    const { socket, currentUserId } = useContext(socketContext);
    const {conversation}=useContext(ConversationContext)
    const [openPopper, setOpenPopper] = useState('');
    const [conversations, setConversations] = useState([]);
    const [activeFilter, setActivFilter] = useState(conversation._id);


    const fetchConversations = async () => {
        try {
            
            const conversations = await conversationService.getConversationByUserId(currentUserId);
            console.log("conversations",conversations)
            for (let i = 0; i < conversations.length; i++) {
                const conversationID = conversations[i]._id;
                const messages = await messageService.getMessageByConversationId(conversationID);
                let totalUnseen = 0;
                
                for (let j = 0; j < messages.length; j++) {
                    if (messages[j].senderId._id !== currentUserId && !messages[j].isSeen.includes(currentUserId)) {
                        totalUnseen = totalUnseen + 1;
                    }
                }
                conversations[i].totalUnseen = totalUnseen;
            }
            setConversations([...conversations]);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [currentUserId]);

    useEffect(() => {
        socket.on('reRenderConversations', () => {
          
            fetchConversations();
        });
    }, []);
    return (
        <div id="wp_user_chat">
            <Search />
            <div className="filter_chat">
                <span onClick={() => setActivFilter(1)} className={clsx('filter_item', activeFilter ? 'active' : '')}>
                    Tất cả
                </span>
                <span onClick={() => setActivFilter(0)} className={clsx('filter_item', !activeFilter ? 'active' : '')}>
                    Chưa đọc
                </span>
            </div>
            <div className="usersChat">
                {conversations.length > 0 &&
                    conversations.map((item, index) => (
                        <ConversationItem
                            activeFilter={activeFilter}
                            onActiveFilter={setActivFilter}
                            conversationId={item._id}
                            senderId={currentUserId}
                            key={index}
                            {...item}
                            openPopper={openPopper}
                            onDetail={() => setOpenPopper(item._id)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Conversation;
