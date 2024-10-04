import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { User } from './entities/user.entity';  // Giả sử bạn đã tạo User entity
import { Role } from './entities/role.entity';  // Giả sử bạn đã tạo Role entity

const dbConfig: MysqlConnectionOptions = {
  type: 'mysql',  // Loại cơ sở dữ liệu
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Loantuyetcute',
  database: 'roadmap',
  entities: [User, Role],
  synchronize: true,
};

export default () => dbConfig;
