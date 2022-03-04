import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import colors from '@field-share/colors';
import { copyToClipboard, toast } from '@field-share/utils';
// COMPONENTS
import Icons from '../components/Icons';
// HOOKS
// LIB

export default {
    title: 'Design System/Atoms/Icons',
    component: Icons,
    argTypes: {
        color: { control: { type: 'color' } },
        icon: { control: { type: null } },
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    padding: '2em',
                    columnGap: 10,
                    rowGap: 10,
                }}
            >
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof Icons>;

const Template: ComponentStory<typeof Icons> = (args) => (
    <>
        {Object.keys(Icons.svgs).map((v, i) => (
            <button
                type="button"
                key={v}
                onClick={() => {
                    copyToClipboard(`<Icon icon=${v} />`);
                    toast.success('아이콘이 복사되었습니다.');
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 80,
                    padding: '0 2rem',
                    backgroundColor: colors.grey[150],
                    borderRadius: 4,
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                }}
            >
                <Icons {...args} icon={v as keyof typeof Icons.svgs} />
                <p style={{ marginTop: 10, fontSize: 12, color: colors.grey[400] }}>{v}</p>
            </button>
        ))}
    </>
);

// const iconWrapper = css`
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     height: 80px;
//     padding: 0 2rem;
//     background-color: ${colors.grey[150]};
//     border-radius: 4px;
//     cursor: pointer;
// `;

export const Default = Template.bind({});
Default.storyName = '아이콘 리스트';
Default.args = {
    color: 'black',
};
