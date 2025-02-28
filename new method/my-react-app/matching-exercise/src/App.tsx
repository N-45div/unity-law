import MatchingExercise from './components/MatchingExercise';
import { matchingData } from './data/matchingData';

function App() {
  return (
    <div className="App">
      <MatchingExercise data={matchingData} />
    </div>
  );
}

export default App;