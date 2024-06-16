import { MdDelete, MdOutlinePushPin, MdPushPin } from "react-icons/md";
import moment from 'moment';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useEffect, useState } from "react";

const NoteCard = ({ title, date, content, isPinned, onEdit, onDelete, onPinNote, animationDelay }) => {
    const [showTitleCursor, setShowTitleCursor] = useState(true);
    const [showContentCursor, setShowContentCursor] = useState(true);
    const [showDateCursor, setShowDateCursor] = useState(true);

    const formattedDate = moment(date).format('Do MMM YYYY');

    const [titleText] = useTypewriter({
        words: [title],
        loop: 1,
    });

    const [contentText] = useTypewriter({
        words: [content],
        loop: 1,
        typeSpeed: 5,
    });

    const [dateText] = useTypewriter({
        words: [formattedDate],
        loop: 1,
    });

    useEffect(() => {
        if (titleText === title) {
            setShowTitleCursor(false);
        }
    }, [titleText, title]);

    useEffect(() => {
        if (contentText === content) {
            setShowContentCursor(false);
        }
    }, [contentText, content]);

    useEffect(() => {
        if (dateText === formattedDate) {
            setShowDateCursor(false);
        }
    }, [dateText, formattedDate]);

    return (
        <div className="border p-4 mb-5 bg-black note-card" style={{ animationDelay: `${animationDelay}ms`, }}>
            <div className="flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={onEdit}>
                        <h6 className="text-sm font-medium text-retroWhite subtle-glitch" data-text={title} style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)' }}>
                            {titleText}
                            {showTitleCursor && <Cursor cursorStyle='_' cursorBlinking={true} />}
                        </h6>

                        <div className="text-xs text-retroWhite mt-2">
                            <p style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)' }}>
                                {contentText}
                                {showContentCursor && <Cursor cursorStyle='_' cursorBlinking={true} />}
                            </p>
                        </div>
                    </div>

                    <div className="ml-2 mt-1">
                        {isPinned ? <MdPushPin className="text-xl text-slate-300 cursor-pointer hover:text-retroWhite" onClick={onPinNote} /> : <MdOutlinePushPin className="text-xl text-slate-300 cursor-pointer hover:text-retroWhite" onClick={onPinNote} />}
                    </div>
                </div>


                <div className="flex items-center justify-between mt-2">
                    <MdDelete
                        className="text-xl text-slate-300 cursor-pointer hover:text-retroWhite"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    />

                    <span className="text-xs text-retroWhite subtle-glitch" data-text={formattedDate} style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)' }}>
                        {dateText}
                        {showDateCursor && <Cursor cursorStyle='_' cursorBlinking={true} />}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
