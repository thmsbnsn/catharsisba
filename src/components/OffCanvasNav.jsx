import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Icon from './Icon.jsx';

export default function OffCanvasNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="backdrop-blur bg-black/40 supports-[backdrop-filter]:bg-black/20">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <a href="/" className="font-display text-2xl tracking-wider">Catharsis</a>
        <button className="rounded-md border border-white/20 px-3 py-1 text-sm hover:bg-white/10"
                onClick={() => setOpen(true)} aria-label="Open menu">
          Menu
        </button>
      </div>
      <Transition show={open} as={Fragment}>
        <Dialog onClose={setOpen} className="relative z-50">
          <Transition.Child as={Fragment} enter="transition-opacity duration-150" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>
          <div className="fixed inset-0 flex justify-end">
            <Transition.Child as={Fragment} enter="transition duration-200" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transition duration-150" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="w-80 max-w-full h-full bg-charcoal text-bone border-l border-white/10 p-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl">Navigate</Dialog.Title>
                  <button className="p-2" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
                </div>
                <nav className="mt-6 space-y-3">
                  <a className="flex items-center gap-3 card p-4 hover:bg-white/10" href="/artists"><Icon id="icon-home"/><span>Artists</span></a>
                  <a className="flex items-center gap-3 card p-4 hover:bg-white/10" href="/gallery"><Icon id="icon-gallery"/><span>Gallery</span></a>
                  <a className="flex items-center gap-3 card p-4 hover:bg-white/10" href="/contact"><Icon id="icon-shop"/><span>Book</span></a>
                  <a className="flex items-center gap-3 card p-4 hover:bg-white/10" href="tel:+13172867092"><Icon id="icon-phone"/><span>(317) 286-7092</span></a>
                </nav>
                <div className="mt-6 text-sm text-white/60">
                  <p>Tue–Sat • 11–7</p>
                  <p>5801 N. Green St. Suite 106, Brownsburg, IN</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
