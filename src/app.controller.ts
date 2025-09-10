import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck(): Promise<object> {
    try {
      // Test database connection
      await this.connection.query('SELECT 1');
      return { 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'connected',
        message: 'Server and database are running' 
      };
    } catch (error) {
      return { 
        status: 'ERROR', 
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        message: 'Database connection failed',
        error: error.message
      };
    }
  }
}