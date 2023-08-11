import { Input, Tooltip } from '@material-tailwind/react';
import { Modal } from 'antd';
import { SVGAddUser, SVGSearh } from '~/assets/svg';
import getLastMessageTime from '~/components/getLastMessageTime/getLastMessageTime';
import textAvatar from '~/components/textAvatar';
import { getChatSuccess } from '~/redux/features/roomSlice';

function Room({
    room,
    roomActive,
    setRoomActive,
    search,
    dispatch,
    setPage,
    navigate,
    showModal,
    isModalOpen,
    handleCancel,
    setKeyword,
    keyword,
    debounceKeyword,
}) {
    return (
        <div className="md:w-1/5 md:min-w-[230px] w-[60px] overflow-auto flex flex-col">
            <div className="flex items-center justify-center flex-col w-full h-16 md:px-4 py-2 border-b">
                <div onClick={showModal}>
                    <Tooltip
                        content="Search new friends"
                        animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0, y: 25 },
                        }}
                    >
                        <div>
                            <SVGAddUser fill="#fff" className="w-6 h-6 my-4 cursor-pointer" />
                        </div>
                    </Tooltip>
                </div>
                <Modal title="Search new friends" open={isModalOpen} onCancel={handleCancel} footer={null}>
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="w-full h-10  mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline">
                            <Input
                                onChange={(e) => setKeyword(e.target.value)}
                                label="Search"
                                icon={<SVGSearh className="w-5 h-5 cursor-pointer " />}
                                value={keyword}
                            />
                        </div>
                        {debounceKeyword ? (
                            search?.data.length > 0 ? (
                                <div className="max-h-[300px] overflow-y-auto w-full">
                                    {search?.data.map((item, index) => (
                                        <div
                                            className="flex items-center justify-between w-full h-16 md:px-4 py-2 border-b cursor-pointer"
                                            key={index}
                                        >
                                            <div className="flex items-center">
                                                {item.avatar ? (
                                                    <img
                                                        className="object-cover w-10 h-10 mr-2 rounded-full bg-orange-500 align-middle"
                                                        src={item.avatar}
                                                        alt={item.name}
                                                    />
                                                ) : (
                                                    <div className="flex -space-x-4">
                                                        {item?.avatar ? (
                                                            <img
                                                                className="w-10 h-10 border-2 bg-orange-500 border-white rounded-full "
                                                                src={item.avatar}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full ">
                                                                <span className="font-medium text-gray-600 ">
                                                                    {textAvatar({ text: item?.username })}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-black ml-4">
                                                    {item.username}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-black">{item.email}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                    <div className="flex items-center justify-center w-full h-16 px-4 py-2">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-black">No result</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <div className="flex items-center justify-center w-full h-16 px-4 py-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-black">Enter keyword</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
            <div className="flex-1">
                {room?.map((item, index) => (
                    <div
                        onClick={() => {
                            setPage(1);
                            setRoomActive(index);
                            dispatch(getChatSuccess([]));
                            navigate(`/room/${item._id}`);
                        }}
                        key={index}
                        className={`flex items-center justify-center md:justify-between w-full h-16 md:px-4 py-2 border-b cursor-pointer
                     bg-slate-500 my-3 hover:bg-[#debc64] transition-all duration-200 ease-in-out 
                     ${index === roomActive ? 'bg-[#debc64]' : ''}`}
                    >
                        <div className="flex items-center ">
                            {item.avatar ? (
                                <img
                                    className="object-cover w-10 h-10 mr-2 rounded-full bg-orange-500 align-middle"
                                    src={item.avatar}
                                    alt={item.name}
                                />
                            ) : (
                                <div className="flex -space-x-4">
                                    {item?.members[0]?.avatar ? (
                                        <img
                                            className="w-10 h-10 border-2 bg-orange-500 border-white rounded-full "
                                            src={item.avatar}
                                            alt=""
                                        />
                                    ) : (
                                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full ">
                                            <span className="font-medium text-gray-600 ">
                                                {textAvatar({ text: item?.members[0]?.username })}
                                            </span>
                                        </div>
                                    )}

                                    {item?.members.length > 1 && (
                                        <div className="flex items-center justify-center w-10 h-10 text-xs font-medium text-orange-500 bg-orange-200 border-2 border-white rounded-full">
                                            +{item?.members.length - 1}
                                        </div>
                                    )}
                                </div>
                            )}

                            <span className="hidden md:block text-sm font-medium text-yellow-50">{item.name}</span>
                        </div>
                        <div className="hidden md:flex items-center ">
                            <span className="text-xs font-medium text-yellow-50">
                                {getLastMessageTime(item.updatedAt)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Room;
