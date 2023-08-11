function textAvatar({ text }) {
    const regex = /(?<=\s|^)[a-z]/gi;

    return text?.match(regex);
}

export default textAvatar;
