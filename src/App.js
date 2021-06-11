import React from 'react';
import { useAuth } from './contexts/auth';

const App = () => {
  const { loaded, isSignedIn, error, signIn, signOut, userData } = useAuth();

  if (!loaded) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="App">
      {isSignedIn ? (
        <div>
          <p>
            What's up {userData.name} with email {userData.email}
          </p>
          <button onClick={signOut}>Log out</button>
        </div>
      ) : (
        <button onClick={signIn}>Login</button>
      )}
    </div>
  );
};

export default App;
