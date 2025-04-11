export const logoutUser = () => {
    localStorage.removeItem('parent');
    localStorage.removeItem('child');
    localStorage.removeItem('role');
    window.location.href = '/'; // Redirect to home or login
  };
  export const logout = (navigate: any) => {
    const role = localStorage.getItem('role');
    localStorage.clear();
    if (role === 'parent') {
      navigate('/login/parent');
    } else {
      navigate('/login/child');
    }
  };