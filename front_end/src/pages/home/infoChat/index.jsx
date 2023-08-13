import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
} from '@material-tailwind/react';
import { message } from 'antd';
import axios from 'axios';
import React, { Fragment } from 'react';
import { SVGArrow, SVGChangeImage, SVGMessenger, SVGPencil, SVGUser } from '~/assets/svg';
import axiosJWT from '~/components/axios';
import socket from '~/components/connnectSocket';
import resizeFile from '~/components/resizeFile';
import textAvatar from '~/components/textAvatar';
import { getRoomsRequest, uploadImageRoomRequest } from '~/redux/features/apiRequest';

function Info({ room, roomActive, user, open, handleOpen, navigate, dispatch }) {
    let axiosJWT_ = axiosJWT(user, dispatch);
    const handleUploadImage = async (e) => {
        try {
            const file = e.target.files[0];
            const image = await resizeFile(file);
            await uploadImageRoomRequest(user, room, roomActive, dispatch, image, axiosJWT_);

            e.target.value = '';
        } catch (error) {
            message.error("Error: Can't upload image");
        }
    };

    React.useEffect(() => {
        socket.on('updateRoom', (data) => {
            getRoomsRequest(user, dispatch, axiosJWT_);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room]);

    return (
        <Fragment>
            <input type="checkbox" id="info" className="hidden" />
            <label
                htmlFor="info"
                className="absolute top-0 right-0 z-10 flex items-center justify-center w-full h-6 bg-black bg-opacity-50 cursor-pointer md:hidden"
            >
                <span className=" text-xl text-white">...</span>
            </label>
            {room && room.length > 0 && (
                <label
                    htmlFor="info"
                    className="info md:w-1/5 md:min-w-[230px] md:flex flex-col hidden overflow-hidden overflow-y-auto"
                >
                    <div className="flex flex-col items-center px-4 py-2 border-b-2 border-white-900">
                        {room[roomActive]?.avatar ? (
                            <img
                                className="object-cover w-20 h-20 rounded-full bg-orange-500 align-middle"
                                src={room[roomActive]?.avatar}
                                alt={room[roomActive]?.name}
                            />
                        ) : (
                            <div className="flex -space-x-4">
                                {room[roomActive]?.members[0]?.avatar ? (
                                    <img
                                        className="w-16 h-1w-16 border-2 border-white rounded-full "
                                        src={room[roomActive]?.members[0]?.avatar}
                                        alt=""
                                    />
                                ) : (
                                    <div className="relative inline-flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-100 rounded-full ">
                                        <span className="font-medium text-gray-600 ">
                                            {textAvatar({ text: room[roomActive]?.members[0]?.username })}
                                        </span>
                                    </div>
                                )}

                                {room[roomActive]?.members.length > 1 && (
                                    <div className="flex items-center justify-center w-16 h-1w-16 text-xs font-medium text-orange-500 bg-orange-200 border-2 border-white rounded-full">
                                        +{room[roomActive]?.members.length - 1}
                                    </div>
                                )}
                            </div>
                        )}

                        <span className="text-sm font-medium text-yellow-50 mt-2">{room[roomActive]?.name}</span>
                    </div>
                    <Fragment>
                        <Accordion open={open === 1} icon={<SVGArrow id={1} open={open} />}>
                            <AccordionHeader
                                className="text-white hover:text-white border-none text-sm"
                                onClick={() => handleOpen(1)}
                            >
                                Customize chats
                            </AccordionHeader>
                            <AccordionBody className="py-0">
                                <div className="text-white hover:text-white border-none text-sm flex items-center cursor-pointer mb-4">
                                    <div className="rounded-full bg-blue-gray-300 h-7 w-7 mr-2">
                                        <SVGPencil className="h-7 w-7" />
                                    </div>
                                    Rename the chat
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="changeImage"
                                    onChange={handleUploadImage}
                                    accept=".png, .jpg, .jpeg"
                                />
                                <label
                                    htmlFor="changeImage"
                                    className="text-white hover:text-white border-none text-sm flex items-center cursor-pointer"
                                >
                                    <div className="rounded-full bg-blue-gray-300 h-7 w-7 mr-2">
                                        <SVGChangeImage className="h-7 w-7" />
                                    </div>
                                    Change photo
                                </label>
                            </AccordionBody>
                        </Accordion>
                        <Accordion open={open === 2} icon={<SVGArrow id={2} open={open} />}>
                            <AccordionHeader
                                className="text-white hover:text-white border-none text-sm"
                                onClick={() => handleOpen(2)}
                            >
                                Members
                            </AccordionHeader>
                            <AccordionBody className="py-0">
                                <div className="flex flex-col items-center  ">
                                    {room[roomActive]?.members.map((member) => (
                                        <div
                                            key={member._id}
                                            className="flex items-center justify-between w-full h-14  cursor-pointer
                                bg-slate-500  hover:bg-[#debc64] transition-all duration-200 ease-in-out px-2 relative"
                                        >
                                            <div className="flex items-center">
                                                {member.avatar ? (
                                                    <img
                                                        className="object-cover w-10 h-10 mr-2 rounded-full bg-orange-500 align-middle"
                                                        src={member.avatar}
                                                        alt={member.name}
                                                    />
                                                ) : (
                                                    <div className="flex -space-x-4">
                                                        {member?.avatar ? (
                                                            <img
                                                                className="mr-2  w-10 h-10 border-2 bg-orange-500 border-white rounded-full "
                                                                src={member.avatar}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="mr-2  relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full ">
                                                                <span className="font-medium text-gray-600 ">
                                                                    {textAvatar({ text: member?.username })}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {member?.members?.length > 1 && (
                                                            <div className="flex items-center justify-center w-10 h-10 text-xs font-medium text-orange-500 bg-orange-200 border-2 border-white rounded-full">
                                                                +{member?.members.length - 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <span className="text-sm font-medium text-yellow-50 limit-username">
                                                    {member.username}
                                                </span>
                                            </div>
                                            {member?._id !== user?._id && (
                                                <Menu placement="bottom-end">
                                                    <MenuHandler>
                                                        <span className=" text-xl text-white -translate-y-5">...</span>
                                                    </MenuHandler>
                                                    <MenuList className="p-0 py-3">
                                                        <MenuItem>
                                                            <div className="flex items-center">
                                                                <SVGMessenger className="mr-4" />
                                                                <span>Nhắn tin</span>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => {
                                                                navigate(`/profile/${member._id}`, {
                                                                    state: {
                                                                        _id: member._id,
                                                                        user_id: user._id,
                                                                        accessToken: user.accessToken,
                                                                    },
                                                                });
                                                            }}
                                                        >
                                                            <div className="flex items-center">
                                                                <SVGUser className="mr-4" />
                                                                <span>Xem thông tin</span>
                                                            </div>
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </AccordionBody>
                        </Accordion>
                    </Fragment>
                </label>
            )}
        </Fragment>
    );
}

export default Info;
