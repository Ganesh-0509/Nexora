import { JobPageMetadata, SupportedPlatform } from "@/lib/types";

export abstract class BaseAdapter {
  abstract platform: SupportedPlatform;
  abstract matches(url: string): boolean;
  abstract extractJobMetadata(): JobPageMetadata | null;
  abstract isApplicationPage(): boolean;
}
