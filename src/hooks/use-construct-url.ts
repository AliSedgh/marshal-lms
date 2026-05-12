import { getPublicObjectUrl } from "@/lib/upload-image";

const useConstructUrl = (key: string) => {
  return getPublicObjectUrl(key);
};

export default useConstructUrl;
