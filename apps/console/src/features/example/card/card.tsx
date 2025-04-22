import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Icons,
  TableView
} from '@ncobase/react';

import { CardLayout } from './layout';

const QueryBar = () => {
  return (
    <div className='sticky -top-[0.9rem] z-666 bg-white shadow-xs flex-col grid -mx-4 -mt-4 px-4 divide-y divide-slate-100'>
      <div className='py-4 flex items-center justify-start'>
        <div className='flex items-center text-slate-800'>类别：</div>
        <div className='flex-1 flex gap-x-4 pl-4'>
          <Button className='focus:ring-0  px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-100/70 text-primary-600'>
            类别
          </Button>
          <Button variant='unstyle'>类别类别类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
        </div>
      </div>
    </div>
  );
};

const RecordCard = () => {
  return (
    <div className='mt-4 grid grid-cols-4 gap-4'>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>用户画像分析</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-danger'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-success-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-warning'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-slate'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <div className='col-span-2 flex flex-col p-0'>
        <TableView
          pageSize={4}
          selected
          visibleControl
          header={[
            { title: '姓名', accessorKey: 'name' },
            { title: '性别', accessorKey: 'sex' },
            { title: '年龄', accessorKey: 'age' }
          ]}
          data={[
            { id: 1, name: '张三', sex: '男', age: 18 },
            { id: 2, name: '张三', sex: '男', age: 18 },
            { id: 3, name: '张三', sex: '男', age: 18 },
            { id: 4, name: '张三', sex: '男', age: 18 },
            { id: 5, name: '张三', sex: '男', age: 18 }
          ]}
        />
      </div>
      <div className='col-span-2 flex flex-col p-0'>
        <TableView
          pageSize={4}
          visibleControl
          header={[
            { title: '姓名', accessorKey: 'name' },
            { title: '性别', accessorKey: 'sex' },
            { title: '年龄', accessorKey: 'age' }
          ]}
          data={[
            { id: 1, name: '张三', sex: '男', age: 18 },
            { id: 2, name: '张三', sex: '男', age: 18 },
            { id: 3, name: '张三', sex: '男', age: 18 },
            { id: 4, name: '张三', sex: '男', age: 18 },
            { id: 5, name: '张三', sex: '男', age: 18 }
          ]}
        />
      </div>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-success-100 rounded-md px-1 py-0.5 ml-2 text-success-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
              已开通
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-danger-100 rounded-md px-1 py-0.5 ml-2 text-danger-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
              已过期
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='primary'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>用户画像分析</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-danger'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-success-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-warning'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-slate'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-success-100 rounded-md px-1 py-0.5 ml-2 text-success-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
              已开通
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-danger-100 rounded-md px-1 py-0.5 ml-2 text-danger-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
              已过期
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='primary'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>用户画像分析</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-danger'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-success-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-warning'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-slate'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-success-100 rounded-md px-1 py-0.5 ml-2 text-success-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
              已开通
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-danger-100 rounded-md px-1 py-0.5 ml-2 text-danger-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
              已过期
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='primary'>开通</Button>
        </CardFooter>
      </Card>
      <div className='col-span-2 flex flex-col p-0'>
        <TableView
          pageSize={4}
          visibleControl
          header={[
            { title: '姓名', accessorKey: 'name' },
            { title: '性别', accessorKey: 'sex' },
            { title: '年龄', accessorKey: 'age' }
          ]}
          data={[
            { id: 1, name: '张三', sex: '男', age: 18 },
            { id: 2, name: '张三', sex: '男', age: 18 },
            { id: 3, name: '张三', sex: '男', age: 18 },
            { id: 4, name: '张三', sex: '男', age: 18 },
            { id: 5, name: '张三', sex: '男', age: 18 }
          ]}
        />
      </div>
      <div className='col-span-2 flex flex-col p-0'>
        <TableView
          pageSize={4}
          header={[
            { title: '姓名', accessorKey: 'name' },
            { title: '性别', accessorKey: 'sex' },
            { title: '年龄', accessorKey: 'age' }
          ]}
          data={[
            { id: 1, name: '张三', sex: '男', age: 18 },
            { id: 2, name: '张三', sex: '男', age: 18 },
            { id: 3, name: '张三', sex: '男', age: 18 },
            { id: 4, name: '张三', sex: '男', age: 18 },
            { id: 5, name: '张三', sex: '男', age: 18 }
          ]}
        />
      </div>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>用户画像分析</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-danger'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-success-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-warning'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-slate'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-success-100 rounded-md px-1 py-0.5 ml-2 text-success-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
              已开通
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-danger-100 rounded-md px-1 py-0.5 ml-2 text-danger-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
              已过期
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='primary'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>用户画像分析</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-danger'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-success-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-warning'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-slate'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-success-100 rounded-md px-1 py-0.5 ml-2 text-success-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
              已开通
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-danger-100 rounded-md px-1 py-0.5 ml-2 text-danger-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
              已过期
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='primary'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>用户画像分析</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-danger'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-success-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-warning'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-slate'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-success-100 rounded-md px-1 py-0.5 ml-2 text-success-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
              已开通
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-danger-100 rounded-md px-1 py-0.5 ml-2 text-danger-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
              已过期
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='primary'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>用户画像分析</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-danger'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-success-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-warning'>开通</Button>
          <Button variant='slate'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex px-1 py-0.5 ml-2'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-slate'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-success-100 rounded-md px-1 py-0.5 ml-2 text-success-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedCheck' className='stroke-green-400' />
              已开通
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='success'>开通</Button>
        </CardFooter>
      </Card>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-lg font-normal'>
            用户画像分析
            <span className='inline-flex bg-danger-100 rounded-md px-1 py-0.5 ml-2 text-danger-500 gap-x-0.5 text-xs'>
              <Icons name='IconSquareRoundedX' className='stroke-red-400' />
              已过期
            </span>
          </CardTitle>
          <CardDescription>2024-03-18 18:14:25</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 text-ellipsis leading-6 text-slate-600'>
          <div className='grid grid-cols-3'>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
            <p>
              <span className='font-medium'>占位标题：</span> <span>占位内容</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-x-4'>
          <Button variant='outline-primary'>取消</Button>
          <Button variant='primary'>开通</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export const CardList = () => {
  return (
    <CardLayout>
      <QueryBar />
      <RecordCard />
    </CardLayout>
  );
};
