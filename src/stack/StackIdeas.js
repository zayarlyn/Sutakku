import { useState, useEffect } from "react";
import { useDB } from "../context/dbProvider";
import { useAuth } from "../context/authProvider";
import Idea from "../idea/Idea";
import Detail from "../idea/Detail";
import StackActions from "./StackActions";

function StackIdea({ stackId, repoUrl }) {
  const [addIdea, setAddIdea] = useState(false);
  const [order, setOrder] = useState('created');
  const [ideas, setIdeas] = useState(null);
  const { listenToIdeas } = useDB();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    const unsub = listenToIdeas(stackId, setIdeas, order);
    return () => unsub;
  }, [user, order]);

  return (
    <section className="w-7/12">
      <h2 className="mb-2 font-lato text-2xl font-medium leading-5 text-white">
        Your stack
      </h2>
      <hr />
      <StackActions repoUrl={repoUrl} setAddIdea={setAddIdea} setOrder={setOrder}/>

      <ul className="mt-4 flex flex-col gap-4">
        {addIdea && (
          <Detail isForm stackId={stackId} handleExpand={() => setAddIdea(false)} />
        )}
        {ideas?.map((idea, i) => (
          <Idea key={idea.id} idx={i} stackId={stackId} idea={idea} />
        ))}
      </ul>
    </section>
  );
}

export default StackIdea;
