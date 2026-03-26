import React from 'react'
import { Image as ImageIcon, Paperclip, Smile, Send } from 'lucide-react'

interface MessageInputProps {
  inputText: string
  setInputText: (text: string) => void
  uploadingImage: boolean
  imageInputRef: React.RefObject<HTMLInputElement>
  handleSend: () => void
  handleSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputText,
  setInputText,
  uploadingImage,
  imageInputRef,
  handleSend,
  handleSelectImage,
}) => {
  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="flex gap-4 mb-3 text-gray-400 px-2">
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="hover:text-blue-600 cursor-pointer transition-colors"
          disabled={uploadingImage}
        >
          <ImageIcon size={20} />
        </button>
        <Paperclip size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
        <Smile size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
        {uploadingImage && <span className="text-xs text-blue-600">图片上传中...</span>}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSelectImage}
        />
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入消息..."
          className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-xl px-4 py-3 text-sm outline-none transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || uploadingImage}
          className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
            inputText.trim() && !uploadingImage
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default MessageInput