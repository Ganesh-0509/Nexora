type LogLevel = "info" | "warn" | "error" | "debug";

export class Logger {
  static info(message: string, meta?: any) {
    this.log("info", message, meta);
  }

  static warn(message: string, meta?: any) {
    this.log("warn", message, meta);
  }

  static error(message: string, meta?: any) {
    this.log("error", message, meta);
  }

  static debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, meta);
    }
  }

  private static log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logObj = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };

    if (level === "error") {
      console.error(JSON.stringify(logObj));
    } else if (level === "warn") {
      console.warn(JSON.stringify(logObj));
    } else {
      console.log(JSON.stringify(logObj));
    }
  }
}
