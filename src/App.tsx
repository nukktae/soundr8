import { ModernVoiceTraining } from './components/training/ModernVoiceTraining';
import { Provider } from 'react-redux';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-[#0a0118]">
        <ModernVoiceTraining />
      </div>
    </Provider>
  );
};

export default App;
