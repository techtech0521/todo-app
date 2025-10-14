import './App.css'
// import React from 'react';
import Header from './components/Header/Header';
import Button from './components/common/Button';
import { Plus, Trash2, Edit2 } from 'lucide-react';

function App() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
      <div className='max-w-4xl mx-auto'>
        <Header />

        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-2xl font-bold mb-4'>ボタンのテスト</h2>

          <div className='space-y-4'>
            <div className='flex gap-2'>
              <Button variant='primary'>
                <Plus size={20} />
                Primary Button
              </Button>
              <Button variant='secondary'>
                Secondary Button
              </Button>
              <Button variant='danger'>
                <Trash2 size={18} />
                Danger Button
              </Button>
              <Button variant='ghost'>
                <Edit2 size={18} />
                Ghost Button
              </Button>
            </div>

            <div className='flex gap-2'>
              <Button size='sm'>Small</Button>
              <Button size='md'>Medium</Button>
              <Button size='lg'>Large</Button>
            </div>

            <div className='flex gap-2'>
              <Button disabled>Disabled Button</Button>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <p className='text-gray-600'>
            ✅ Headerが表示されています<br />
            ✅ Buttonコンポーネントが動作しています<br />
            ✅ Tailwindが正しく適用されています<br />
            ✅ lucide-reactのアイコンが表示されています
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
