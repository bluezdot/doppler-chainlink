import { 
  IAdapterFactory, 
  IProtocolAdapter, 
  AdapterConfig 
} from "./types";
import { V2Adapter } from "./V2Adapter";
import { V3Adapter } from "./V3Adapter";
import { V4Adapter } from "./V4Adapter";

/**
 * Factory for creating protocol-specific adapters
 */
export class AdapterFactory implements IAdapterFactory {
  private static instance: AdapterFactory;
  private adapters: Map<string, IProtocolAdapter> = new Map();

  /**
   * Get singleton instance
   */
  static getInstance(): AdapterFactory {
    if (!AdapterFactory.instance) {
      AdapterFactory.instance = new AdapterFactory();
    }
    return AdapterFactory.instance;
  }

  /**
   * Create or retrieve a cached adapter based on configuration
   */
  createAdapter(config: AdapterConfig): IProtocolAdapter {
    const cacheKey = `${config.chainId}-${config.protocolVersion}`;
    
    // Check if adapter already exists
    const existingAdapter = this.adapters.get(cacheKey);
    if (existingAdapter) {
      return existingAdapter;
    }

    // Create new adapter based on protocol version
    let adapter: IProtocolAdapter;
    
    switch (config.protocolVersion) {
      case "v2":
        adapter = new V2Adapter(config);
        break;
      case "v3":
        adapter = new V3Adapter(config);
        break;
      case "v4":
        adapter = new V4Adapter(config);
        break;
      default:
        throw new Error(`Unsupported protocol version: ${config.protocolVersion}`);
    }

    // Cache the adapter
    this.adapters.set(cacheKey, adapter);
    
    return adapter;
  }

  /**
   * Clear cached adapters (useful for testing)
   */
  clearCache(): void {
    this.adapters.clear();
  }
}

/**
 * Helper function to get adapter for a specific protocol and chain
 */
export function getProtocolAdapter(
  chainId: number,
  protocolVersion: "v2" | "v3" | "v4",
  contracts: AdapterConfig["contracts"] = {}
): IProtocolAdapter {
  const factory = AdapterFactory.getInstance();
  
  return factory.createAdapter({
    chainId,
    protocolVersion,
    contracts,
  });
}