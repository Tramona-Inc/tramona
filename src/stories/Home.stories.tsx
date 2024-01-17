import Home from '../pages/index';
import { TooltipProvider } from '@/components/ui/tooltip';

export const HomeExample = () => {
  return (
    <TooltipProvider delayDuration={100}>
      <Home />
    </TooltipProvider>
  );
};

const storyConfig = {
  title: 'Pages/Home',
  component: HomeExample,
};

export default storyConfig;
