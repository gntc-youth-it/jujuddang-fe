import { useState, useEffect } from 'react';

export const useTeam = () => {
  const [teamNumber, setTeamNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 팀 번호 가져오기
    const savedTeam = localStorage.getItem('teamNumber');
    if (savedTeam) {
      setTeamNumber(parseInt(savedTeam));
    }
    setIsLoading(false);
  }, []);

  const updateTeam = (newTeamNumber: number) => {
    localStorage.setItem('teamNumber', newTeamNumber.toString());
    setTeamNumber(newTeamNumber);
  };

  const clearTeam = () => {
    localStorage.removeItem('teamNumber');
    setTeamNumber(null);
  };

  return {
    teamNumber,
    isLoading,
    updateTeam,
    clearTeam,
    hasTeam: teamNumber !== null
  };
}; 