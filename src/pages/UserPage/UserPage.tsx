import { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import { getUser } from '../../api/api';
import type { User } from '../../types/admin.types';
import { openNotification } from '@/utils/errors';



const UserPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { id } = useParams();
  console.log('id: ', id);


  const fetchAndSetUser = async (id: number) => {
    try {
      setIsLoading(true);
      const user = await getUser(id);
      if (user) {
        setCurrentUser(user);
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error', 
          title: 'ERROR: Get All Todo', 
          description:`${err.message}`
        })
      }
    } finally {
      setIsLoading(false);
    }
  } 

  useEffect(() => {
    if (id){
      fetchAndSetUser(+id);
    }
  }, []);


  return (
    <div>
      id: {id}
      {isLoading && <p>isLoading ...</p>}
      {!isLoading && currentUser && <>
        <p>{currentUser?.username}</p>
        <p>{currentUser?.email}</p>
        <p>{currentUser?.phoneNumber}</p>
      </>}
    </div>
  )
}

export default UserPage;