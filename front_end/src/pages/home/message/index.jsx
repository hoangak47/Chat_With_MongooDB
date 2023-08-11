import { Fragment } from 'react';
import getLastMessageTime from '~/components/getLastMessageTime/getLastMessageTime';
import textAvatar from '~/components/textAvatar';

function Message({ room, roomActive, user, chat, chat_, chat_end }) {
    return (
        <div className="md:w-3/5 w-4/5 overflow-hidden flex">
            {room && room.length > 0 ? (
                <div
                    ref={chat_}
                    className="flex flex-col-reverse justify-between w-full h-full overflow-auto  px-4 py-2 chat"
                >
                    <div className=" container md:px-8 scroll-p-0  pt-12">
                        {chat?.loading && (
                            <div className="flex items-center justify-center w-full h-16 px-4 py-2">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-yellow-50">Loading...</span>
                                </div>
                            </div>
                        )}
                        {chat?.data?.map((message, index) => {
                            return (
                                <div key={index}>
                                    <div
                                        className={`flex flex-col my-1 ${
                                            message.sender === user?._id ? 'items-end' : 'items-start'
                                        }`}
                                    >
                                        <div className="flex">
                                            {chat?.data?.[index + 1]?.sender === message.sender && (
                                                <div className="flex items-end  mr-1">
                                                    <div className="object-cover w-7 h-7 ml-2 mr-2 rounded-full bg-transparent align-middle"></div>
                                                </div>
                                            )}
                                            {message.sender !== user?._id && (
                                                <Fragment>
                                                    {room[roomActive]?.members.map((member, i) => {
                                                        return (
                                                            <Fragment key={member._id}>
                                                                {message.sender === member._id &&
                                                                    chat?.data?.[index + 1]?.sender !==
                                                                        message.sender && (
                                                                        <div className="flex items-end  mr-1">
                                                                            {member?.avatar ? (
                                                                                <img
                                                                                    className="object-cover w-7 h-7 ml-2 mr-2 rounded-full bg-orange-500 align-middle"
                                                                                    src={member?.avatar}
                                                                                    alt={member?.name}
                                                                                />
                                                                            ) : (
                                                                                <div className="relative inline-flex items-center justify-center w-7 h-7 ml-2 mr-2 overflow-hidden bg-gray-100 rounded-full ">
                                                                                    <span className="font-medium text-gray-600 ">
                                                                                        {textAvatar({
                                                                                            text: member?.username,
                                                                                        })}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </Fragment>
                                                        );
                                                    })}
                                                </Fragment>
                                            )}
                                            <div
                                                className={`${
                                                    message.sender === user?._id
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                } rounded-md p-2 max-w-xs min-w-[75px] w-auto break-words`}
                                            >
                                                {message.msg}
                                            </div>
                                        </div>
                                        {index < chat?.data?.length - 1 ? (
                                            chat?.data[index + 1].sender !== message.sender && (
                                                <div className="text-xs text-gray-500">
                                                    {getLastMessageTime(message.updatedAt)}
                                                </div>
                                            )
                                        ) : (
                                            <div className="text-xs text-gray-500">
                                                {getLastMessageTime(message.updatedAt)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {chat?.data[0] && (
                            <div className="flex items-center justify-end w-full px-4 py-2">
                                {chat?.data[0]?.read.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {item !== user?._id && (
                                                <div className="flex items-end mr-1">
                                                    {item?.avatar ? (
                                                        <img
                                                            className="object-cover w-4 h-4 rounded-full bg-orange-500 align-middle"
                                                            src={item?.avatar}
                                                            alt={item?.name}
                                                        />
                                                    ) : (
                                                        <div className="relative inline-flex items-center justify-center w-4 h-4 overflow-hidden bg-gray-100 rounded-full ">
                                                            <span className="text-xs text-gray-600 ">
                                                                {textAvatar({
                                                                    text: item?.username,
                                                                })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </div>
                        )}
                        <div ref={chat_end} className="chat-end"></div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <span className="text-sm font-medium text-yellow-50">No chat</span>
                </div>
            )}
        </div>
    );
}

export default Message;
