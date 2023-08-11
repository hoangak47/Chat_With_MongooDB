import Chat from '../chat/Chat';
import Header from '../header/Header';
import Section from '../section/Section';

function Layout({ children, chat = false }) {
    return (
        <main className="flex flex-col h-screen bg-[#131316] ">
            <Section>
                <Header />
            </Section>
            <main className="main flex-1 overflow-y-auto hidden-scrollbar text-white">{children}</main>
            {chat && (
                <Section>
                    <Chat />
                </Section>
            )}
        </main>
    );
}

export default Layout;
