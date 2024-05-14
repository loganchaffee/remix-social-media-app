import dayjs from "dayjs";

type Props = {
  username: string;
  content: string;
  createdAt: string;
};

export const Post = ({ username, content, createdAt }: Props) => {
  return (
    <div className="p-5 rounded-md border mb-5">
      <div className="border-b pb-2 text-gray-400">{username}</div>
      <div className="py-5">{content}</div>
      <div className="text-xs text-end text-gray-400">
        {dayjs(createdAt).format("MMMM D, YYYY h:mm A")}
      </div>
    </div>
  );
};
