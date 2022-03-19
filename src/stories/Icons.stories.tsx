import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import colors from '@field-share/styles';
import { copyToClipboard } from '@field-share/utils';
// COMPONENTS
import Icons from '../components/Icons';
import toast from '../components/Toast';
// HOOKS
// LIB

export default {
    title: 'Design System/Atoms/Icons',
    component: Icons,
    argTypes: {
        color: { control: { type: 'color' } },
        icon: { control: { type: null } },
    },
} as ComponentMeta<typeof Icons>;

const Template: ComponentStory<typeof Icons> = (args) => (
    <div style={{}}>
        <h3>아이콘 크기 24px로 고정 (wjLogo 제외)</h3>
        <p style={{ color: 'gray', fontSize: 14 }}>* 흰색 박스는 가이드라인입니다. 아이콘에 포함되지 않습니다.</p>
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 10,
                rowGap: 10,
            }}
        >
            {Object.keys(Icons.svgs).map((v, i) => (
                <button
                    type="button"
                    key={v}
                    onClick={async () => {
                        await copyToClipboard(`<Icon icon=${v} />`);
                        toast.success(`'${v}' 아이콘이 복사되었습니다.`);
                    }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 80,
                        padding: '0 2rem',
                        backgroundColor: colors.grey[200],
                        borderRadius: 4,
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                    }}
                >
                    <Icons
                        {...args}
                        icon={v as keyof typeof Icons.svgs}
                        style={
                            v === 'wjLogo'
                                ? {}
                                : {
                                      width: 24,
                                      height: 24,
                                      borderStyle: 'solid',
                                      borderColor: '#fff',
                                      borderWidth: 1,
                                  }
                        }
                    />
                    <p style={{ marginTop: 10, fontSize: 12, color: colors.grey[600] }}>{v}</p>
                </button>
            ))}
        </div>
    </div>
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
    color: colors.grey[600],
};
