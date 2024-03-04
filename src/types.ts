declare module "obsidian" {
    interface App {
        internalPlugins: {
            getPluginById(id: "sync"): {
                _loaded: boolean;
                instance: Events & {
                    deviceName: string;
                    getDefaultDeviceName(): string;
                    getStatus():
                        | "error"
                        | "paused"
                        | "syncing"
                        | "uninitialized"
                        | "synced";
                    on(name: "status-change", callback: () => any): EventRef;
                };
            };
        };
    }
    interface Plugin {
        onConfigFileChange: () => void;
        handleConfigFileChange(): Promise<void>;
    }
}

export {};
