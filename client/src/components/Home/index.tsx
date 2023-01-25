import { FunctionComponent } from 'react';
import Ticket from '../../assets/images/movie_tickets.jpg';

const Home: FunctionComponent = () => {
  return (
    <div>
      <h2>Find a Movie to watch tonight!</h2>
      <hr />
      <img src={Ticket} alt="Movie Tickets" />
    </div>
  );
};

export default Home;
