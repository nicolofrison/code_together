import { appDataSource } from './config/data-source';
import { User } from './entities/User';

appDataSource
  .initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.email = 'Timber';
    user.password = 'Saw';

    await appDataSource.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await appDataSource.manager.find(User);
    console.log('Loaded users: ', users);

    console.log(
      'Here you can setup and run express / fastify / any other framework.'
    );
  })
  .catch((error) => console.log(error));
