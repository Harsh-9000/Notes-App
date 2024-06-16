import { useEffect } from "react"
import { LuCheck } from "react-icons/lu"
import { MdDelete } from "react-icons/md"

const Toast = ({ isShown, message, type, onClose }) => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            clearTimeout(timeoutId)
        }
    }, [onClose])

    return (
        <div
            className={`absolute top-20 transition-all duration-500 ${isShown ? "right-2" : "-right-80"}`}
            style={{ boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.7)' }}
        >
            <div
                className="min-w-72 bg-black border-2 shadow-2xl after:w-[5px] after:h-full after:bg-retroWhite after:absolute after:left-0 after:top-0"
                style={{ boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.7)' }}
            >
                <div className="flex items-center gap-3 py-2 px-2">
                    <div
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-retroWhite"
                        style={{ boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.7)' }}
                    >
                        {type === "delete" ? (
                            <MdDelete className="text-xl text-black" />
                        ) : (
                            <LuCheck className="text-xl text-black" />
                        )}
                    </div>

                    <p className="text-sm text-retroWhite" style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)' }}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Toast