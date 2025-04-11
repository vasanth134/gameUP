import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">👋 Welcome to Task Hero!</h1>
        <p className="mb-8 text-gray-600">Please choose your role to login:</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login/parent')}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            👨‍👧 I’m a Parent
          </button>

            <button
                onClick={() => navigate('/signup/parent')}
                className="bg-white-600 text-black py-3 rounded-lg font-semibold hover:text-gray-700 transition">Sign Up </button>
          <button
            onClick={() => navigate('/login/child')}
            className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            🎮 I’m a Child
          </button>
            <button
                onClick={() => navigate('/signup/child')}
                className="bg-white-600 text-black py-3 rounded-lg font-semibold hover:text-gray-700 transition" > Sign Up </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
