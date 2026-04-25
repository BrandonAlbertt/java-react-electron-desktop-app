
import PlayerBar from "../components/layout/PlayerBar";
import PlaylistPanel from "../components/music/PlaylistPanel";
import NowPlayingPanel from "../components/music/NowPlayingPanel";
import ExplorePanel from "../components/music/ExplorePanel";
import TopHeader from "../components/layout/TopHeader";
import CarouselGeneres from "../components/music/CarouselGeneres";





export default function Home() {
    return (
        <section className="h-full w-full bg-gradient-to-b from-[#0d0d12] via-[#09090d] to-[#050507]">
            <div className="flex h-full w-full flex-col">

                {/* HEADER SUPERIOR */}
                <TopHeader />

                {/* CONTENIDO CENTRAL */}
                <div className="flex-1 overflow-hidden p-3 md:p-4">
                    <div className="grid h-full grid-cols-12 gap-3 md:gap-4">

                        {/* IZQUIERDA */}
                        <aside className="col-span-12 min-h-0 rounded-2xl border border-fuchsia-500/20 bg-[#0a0a0f] lg:col-span-4">
                            <PlaylistPanel />
                        </aside>

                        {/* CENTRO */}
                        <section className="col-span-12 min-h-0 lg:col-span-3">
                            <NowPlayingPanel />
                        </section>

                        {/* DERECHA */}
                        <aside className="col-span-12  flex flex-col gap-2 min-h-0 lg:col-span-5">
                            <CarouselGeneres />
                            <ExplorePanel />
                        </aside>
                    </div>
                </div>

                {/* PLAYER INFERIOR */}
                <footer className="h-[120px] w-full shrink-0 border-t border-white/10 px-3 py-3 md:h-[130px] md:px-4">
                    <PlayerBar />
                </footer>
            </div>
        </section>
    );
}