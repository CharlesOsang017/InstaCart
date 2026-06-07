import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center -mt-20 min-h-96 h-full w-full">
      <Loader2Icon className="animate-spin size-8 text-green-950" />
    </div>
  );
};

export default Loading;
