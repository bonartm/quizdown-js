/* Version: 0.5.0 - January 22, 2022 01:18:45 */

(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.quizdown = factory());
}(this, (function () { 'use strict';

    function noop$2() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$2;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$2;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function append_styles(target, style_sheet_id, styles) {
        const append_styles_to = get_root_for_style(target);
        if (!append_styles_to.getElementById(style_sheet_id)) {
            const style = element('style');
            style.id = style_sheet_id;
            style.textContent = styles;
            append_stylesheet(append_styles_to, style);
        }
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text$1(' ');
    }
    function empty() {
        return text$1('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop$2;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop$2;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop$2, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$2, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$2,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$2;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$2) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$2) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$2;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$2;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$2;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src/components/ProgressBar.svelte generated by Svelte v3.44.1 */
    const file$f = "src/components/ProgressBar.svelte";

    function add_css$b(target) {
    	append_styles(target, "svelte-y5vpfu", ".progress.svelte-y5vpfu.svelte-y5vpfu{grid-area:auto;height:0.4em;width:100%;position:relative}.progress.svelte-y5vpfu .progress-slider.svelte-y5vpfu{background-color:var(--quizdown-color-primary);height:100%;display:block}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZ3Jlc3NCYXIuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQUNJLFNBQUEsNEJBQUEsQ0FBQSxBQUNJLFNBQUEsQ0FBQSxJQUFlLENBRWYsTUFBQSxDQUFBLEtBQWEsQ0FDYixLQUFBLENBQUEsSUFBVyxDQUNYLFFBQUEsQ0FBQSxRQUFrQixBQUN0QixDQUFBLEFBRUEsdUJBQUEsQ0FBQSxnQkFBQSxjQUFBLENBQUEsQUFDSSxnQkFBQSxDQUFBLElBQUEsd0JBQUEsQ0FBK0MsQ0FDL0MsTUFBQSxDQUFBLElBQVksQ0FDWixPQUFBLENBQUEsS0FBYyxBQUNsQixDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLnN2ZWx0ZSJdfQ== */");
    }

    function create_fragment$h(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "progress-slider svelte-y5vpfu");
    			set_style(div0, "width", /*progressPercent*/ ctx[0]);
    			add_location(div0, file$f, 13, 4, 375);
    			attr_dev(div1, "class", "progress svelte-y5vpfu");
    			attr_dev(div1, "data-label", "");
    			add_location(div1, file$f, 12, 0, 334);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*progressPercent*/ 1) {
    				set_style(div0, "width", /*progressPercent*/ ctx[0]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let progressPercent;
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProgressBar', slots, []);
    	let { value } = $$props;
    	let { max } = $$props;
    	const progress = tweened(0, { duration: 400, easing: cubicOut });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(4, $progress = value));
    	const writable_props = ['value', 'max'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProgressBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('max' in $$props) $$invalidate(3, max = $$props.max);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		cubicOut,
    		value,
    		max,
    		progress,
    		progressPercent,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('max' in $$props) $$invalidate(3, max = $$props.max);
    		if ('progressPercent' in $$props) $$invalidate(0, progressPercent = $$props.progressPercent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*max, value*/ 12) {
    			progress.set(Math.min(max, value) + 0.5);
    		}

    		if ($$self.$$.dirty & /*$progress, max*/ 24) {
    			$$invalidate(0, progressPercent = String($progress / (max + 0.5) * 100) + '%');
    		}
    	};

    	return [progressPercent, progress, value, max, $progress];
    }

    class ProgressBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$h, create_fragment$h, safe_not_equal, { value: 2, max: 3 }, add_css$b);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressBar",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[2] === undefined && !('value' in props)) {
    			console.warn("<ProgressBar> was created without expected prop 'value'");
    		}

    		if (/*max*/ ctx[3] === undefined && !('max' in props)) {
    			console.warn("<ProgressBar> was created without expected prop 'max'");
    		}
    	}

    	get value() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var isMergeableObject = function isMergeableObject(value) {
    	return isNonNullObject(value)
    		&& !isSpecial(value)
    };

    function isNonNullObject(value) {
    	return !!value && typeof value === 'object'
    }

    function isSpecial(value) {
    	var stringValue = Object.prototype.toString.call(value);

    	return stringValue === '[object RegExp]'
    		|| stringValue === '[object Date]'
    		|| isReactElement(value)
    }

    // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
    var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

    function isReactElement(value) {
    	return value.$$typeof === REACT_ELEMENT_TYPE
    }

    function emptyTarget(val) {
    	return Array.isArray(val) ? [] : {}
    }

    function cloneUnlessOtherwiseSpecified(value, options) {
    	return (options.clone !== false && options.isMergeableObject(value))
    		? deepmerge(emptyTarget(value), value, options)
    		: value
    }

    function defaultArrayMerge(target, source, options) {
    	return target.concat(source).map(function(element) {
    		return cloneUnlessOtherwiseSpecified(element, options)
    	})
    }

    function getMergeFunction(key, options) {
    	if (!options.customMerge) {
    		return deepmerge
    	}
    	var customMerge = options.customMerge(key);
    	return typeof customMerge === 'function' ? customMerge : deepmerge
    }

    function getEnumerableOwnPropertySymbols(target) {
    	return Object.getOwnPropertySymbols
    		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
    			return target.propertyIsEnumerable(symbol)
    		})
    		: []
    }

    function getKeys(target) {
    	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
    }

    function propertyIsOnObject(object, property) {
    	try {
    		return property in object
    	} catch(_) {
    		return false
    	}
    }

    // Protects from prototype poisoning and unexpected merging up the prototype chain.
    function propertyIsUnsafe(target, key) {
    	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
    			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
    }

    function mergeObject(target, source, options) {
    	var destination = {};
    	if (options.isMergeableObject(target)) {
    		getKeys(target).forEach(function(key) {
    			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    		});
    	}
    	getKeys(source).forEach(function(key) {
    		if (propertyIsUnsafe(target, key)) {
    			return
    		}

    		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
    			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
    		} else {
    			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    		}
    	});
    	return destination
    }

    function deepmerge(target, source, options) {
    	options = options || {};
    	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    	// implementations can use it. The caller may not replace it.
    	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

    	var sourceIsArray = Array.isArray(source);
    	var targetIsArray = Array.isArray(target);
    	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    	if (!sourceAndTargetTypesMatch) {
    		return cloneUnlessOtherwiseSpecified(source, options)
    	} else if (sourceIsArray) {
    		return options.arrayMerge(target, source, options)
    	} else {
    		return mergeObject(target, source, options)
    	}
    }

    deepmerge.all = function deepmergeAll(array, options) {
    	if (!Array.isArray(array)) {
    		throw new Error('first argument should be an array')
    	}

    	return array.reduce(function(prev, next) {
    		return deepmerge(prev, next, options)
    	}, {})
    };

    var deepmerge_1 = deepmerge;

    var cjs = deepmerge_1;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || from);
    }

    var ErrorKind;
    (function (ErrorKind) {
        /** Argument is unclosed (e.g. `{0`) */
        ErrorKind[ErrorKind["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
        /** Argument is empty (e.g. `{}`). */
        ErrorKind[ErrorKind["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
        /** Argument is malformed (e.g. `{foo!}``) */
        ErrorKind[ErrorKind["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
        /** Expect an argument type (e.g. `{foo,}`) */
        ErrorKind[ErrorKind["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
        /** Unsupported argument type (e.g. `{foo,foo}`) */
        ErrorKind[ErrorKind["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
        /** Expect an argument style (e.g. `{foo, number, }`) */
        ErrorKind[ErrorKind["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
        /** The number skeleton is invalid. */
        ErrorKind[ErrorKind["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
        /** The date time skeleton is invalid. */
        ErrorKind[ErrorKind["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
        /** Exepct a number skeleton following the `::` (e.g. `{foo, number, ::}`) */
        ErrorKind[ErrorKind["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
        /** Exepct a date time skeleton following the `::` (e.g. `{foo, date, ::}`) */
        ErrorKind[ErrorKind["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
        /** Unmatched apostrophes in the argument style (e.g. `{foo, number, 'test`) */
        ErrorKind[ErrorKind["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
        /** Missing select argument options (e.g. `{foo, select}`) */
        ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
        /** Expecting an offset value in `plural` or `selectordinal` argument (e.g `{foo, plural, offset}`) */
        ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
        /** Offset value in `plural` or `selectordinal` is invalid (e.g. `{foo, plural, offset: x}`) */
        ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
        /** Expecting a selector in `select` argument (e.g `{foo, select}`) */
        ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
        /** Expecting a selector in `plural` or `selectordinal` argument (e.g `{foo, plural}`) */
        ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
        /** Expecting a message fragment after the `select` selector (e.g. `{foo, select, apple}`) */
        ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
        /**
         * Expecting a message fragment after the `plural` or `selectordinal` selector
         * (e.g. `{foo, plural, one}`)
         */
        ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
        /** Selector in `plural` or `selectordinal` is malformed (e.g. `{foo, plural, =x {#}}`) */
        ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
        /**
         * Duplicate selectors in `plural` or `selectordinal` argument.
         * (e.g. {foo, plural, one {#} one {#}})
         */
        ErrorKind[ErrorKind["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
        /** Duplicate selectors in `select` argument.
         * (e.g. {foo, select, apple {apple} apple {apple}})
         */
        ErrorKind[ErrorKind["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
        /** Plural or select argument option must have `other` clause. */
        ErrorKind[ErrorKind["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
        /** The tag is malformed. (e.g. `<bold!>foo</bold!>) */
        ErrorKind[ErrorKind["INVALID_TAG"] = 23] = "INVALID_TAG";
        /** The tag name is invalid. (e.g. `<123>foo</123>`) */
        ErrorKind[ErrorKind["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
        /** The closing tag does not match the opening tag. (e.g. `<bold>foo</italic>`) */
        ErrorKind[ErrorKind["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
        /** The opening tag has unmatched closing tag. (e.g. `<bold>foo`) */
        ErrorKind[ErrorKind["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
    })(ErrorKind || (ErrorKind = {}));

    var TYPE;
    (function (TYPE) {
        /**
         * Raw text
         */
        TYPE[TYPE["literal"] = 0] = "literal";
        /**
         * Variable w/o any format, e.g `var` in `this is a {var}`
         */
        TYPE[TYPE["argument"] = 1] = "argument";
        /**
         * Variable w/ number format
         */
        TYPE[TYPE["number"] = 2] = "number";
        /**
         * Variable w/ date format
         */
        TYPE[TYPE["date"] = 3] = "date";
        /**
         * Variable w/ time format
         */
        TYPE[TYPE["time"] = 4] = "time";
        /**
         * Variable w/ select format
         */
        TYPE[TYPE["select"] = 5] = "select";
        /**
         * Variable w/ plural format
         */
        TYPE[TYPE["plural"] = 6] = "plural";
        /**
         * Only possible within plural argument.
         * This is the `#` symbol that will be substituted with the count.
         */
        TYPE[TYPE["pound"] = 7] = "pound";
        /**
         * XML-like tag
         */
        TYPE[TYPE["tag"] = 8] = "tag";
    })(TYPE || (TYPE = {}));
    var SKELETON_TYPE;
    (function (SKELETON_TYPE) {
        SKELETON_TYPE[SKELETON_TYPE["number"] = 0] = "number";
        SKELETON_TYPE[SKELETON_TYPE["dateTime"] = 1] = "dateTime";
    })(SKELETON_TYPE || (SKELETON_TYPE = {}));
    /**
     * Type Guards
     */
    function isLiteralElement(el) {
        return el.type === TYPE.literal;
    }
    function isArgumentElement(el) {
        return el.type === TYPE.argument;
    }
    function isNumberElement(el) {
        return el.type === TYPE.number;
    }
    function isDateElement(el) {
        return el.type === TYPE.date;
    }
    function isTimeElement(el) {
        return el.type === TYPE.time;
    }
    function isSelectElement(el) {
        return el.type === TYPE.select;
    }
    function isPluralElement(el) {
        return el.type === TYPE.plural;
    }
    function isPoundElement(el) {
        return el.type === TYPE.pound;
    }
    function isTagElement(el) {
        return el.type === TYPE.tag;
    }
    function isNumberSkeleton(el) {
        return !!(el && typeof el === 'object' && el.type === SKELETON_TYPE.number);
    }
    function isDateTimeSkeleton(el) {
        return !!(el && typeof el === 'object' && el.type === SKELETON_TYPE.dateTime);
    }

    // @generated from regex-gen.ts
    var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;

    /**
     * https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     * Credit: https://github.com/caridy/intl-datetimeformat-pattern/blob/master/index.js
     * with some tweaks
     */
    var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
    /**
     * Parse Date time skeleton into Intl.DateTimeFormatOptions
     * Ref: https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     * @public
     * @param skeleton skeleton string
     */
    function parseDateTimeSkeleton(skeleton) {
        var result = {};
        skeleton.replace(DATE_TIME_REGEX, function (match) {
            var len = match.length;
            switch (match[0]) {
                // Era
                case 'G':
                    result.era = len === 4 ? 'long' : len === 5 ? 'narrow' : 'short';
                    break;
                // Year
                case 'y':
                    result.year = len === 2 ? '2-digit' : 'numeric';
                    break;
                case 'Y':
                case 'u':
                case 'U':
                case 'r':
                    throw new RangeError('`Y/u/U/r` (year) patterns are not supported, use `y` instead');
                // Quarter
                case 'q':
                case 'Q':
                    throw new RangeError('`q/Q` (quarter) patterns are not supported');
                // Month
                case 'M':
                case 'L':
                    result.month = ['numeric', '2-digit', 'short', 'long', 'narrow'][len - 1];
                    break;
                // Week
                case 'w':
                case 'W':
                    throw new RangeError('`w/W` (week) patterns are not supported');
                case 'd':
                    result.day = ['numeric', '2-digit'][len - 1];
                    break;
                case 'D':
                case 'F':
                case 'g':
                    throw new RangeError('`D/F/g` (day) patterns are not supported, use `d` instead');
                // Weekday
                case 'E':
                    result.weekday = len === 4 ? 'short' : len === 5 ? 'narrow' : 'short';
                    break;
                case 'e':
                    if (len < 4) {
                        throw new RangeError('`e..eee` (weekday) patterns are not supported');
                    }
                    result.weekday = ['short', 'long', 'narrow', 'short'][len - 4];
                    break;
                case 'c':
                    if (len < 4) {
                        throw new RangeError('`c..ccc` (weekday) patterns are not supported');
                    }
                    result.weekday = ['short', 'long', 'narrow', 'short'][len - 4];
                    break;
                // Period
                case 'a': // AM, PM
                    result.hour12 = true;
                    break;
                case 'b': // am, pm, noon, midnight
                case 'B': // flexible day periods
                    throw new RangeError('`b/B` (period) patterns are not supported, use `a` instead');
                // Hour
                case 'h':
                    result.hourCycle = 'h12';
                    result.hour = ['numeric', '2-digit'][len - 1];
                    break;
                case 'H':
                    result.hourCycle = 'h23';
                    result.hour = ['numeric', '2-digit'][len - 1];
                    break;
                case 'K':
                    result.hourCycle = 'h11';
                    result.hour = ['numeric', '2-digit'][len - 1];
                    break;
                case 'k':
                    result.hourCycle = 'h24';
                    result.hour = ['numeric', '2-digit'][len - 1];
                    break;
                case 'j':
                case 'J':
                case 'C':
                    throw new RangeError('`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead');
                // Minute
                case 'm':
                    result.minute = ['numeric', '2-digit'][len - 1];
                    break;
                // Second
                case 's':
                    result.second = ['numeric', '2-digit'][len - 1];
                    break;
                case 'S':
                case 'A':
                    throw new RangeError('`S/A` (second) patterns are not supported, use `s` instead');
                // Zone
                case 'z': // 1..3, 4: specific non-location format
                    result.timeZoneName = len < 4 ? 'short' : 'long';
                    break;
                case 'Z': // 1..3, 4, 5: The ISO8601 varios formats
                case 'O': // 1, 4: miliseconds in day short, long
                case 'v': // 1, 4: generic non-location format
                case 'V': // 1, 2, 3, 4: time zone ID or city
                case 'X': // 1, 2, 3, 4: The ISO8601 varios formats
                case 'x': // 1, 2, 3, 4: The ISO8601 varios formats
                    throw new RangeError('`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead');
            }
            return '';
        });
        return result;
    }

    // @generated from regex-gen.ts
    var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;

    function parseNumberSkeletonFromString(skeleton) {
        if (skeleton.length === 0) {
            throw new Error('Number skeleton cannot be empty');
        }
        // Parse the skeleton
        var stringTokens = skeleton
            .split(WHITE_SPACE_REGEX)
            .filter(function (x) { return x.length > 0; });
        var tokens = [];
        for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
            var stringToken = stringTokens_1[_i];
            var stemAndOptions = stringToken.split('/');
            if (stemAndOptions.length === 0) {
                throw new Error('Invalid number skeleton');
            }
            var stem = stemAndOptions[0], options = stemAndOptions.slice(1);
            for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
                var option = options_1[_a];
                if (option.length === 0) {
                    throw new Error('Invalid number skeleton');
                }
            }
            tokens.push({ stem: stem, options: options });
        }
        return tokens;
    }
    function icuUnitToEcma(unit) {
        return unit.replace(/^(.*?)-/, '');
    }
    var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
    var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?$/g;
    var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
    var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
    function parseSignificantPrecision(str) {
        var result = {};
        str.replace(SIGNIFICANT_PRECISION_REGEX, function (_, g1, g2) {
            // @@@ case
            if (typeof g2 !== 'string') {
                result.minimumSignificantDigits = g1.length;
                result.maximumSignificantDigits = g1.length;
            }
            // @@@+ case
            else if (g2 === '+') {
                result.minimumSignificantDigits = g1.length;
            }
            // .### case
            else if (g1[0] === '#') {
                result.maximumSignificantDigits = g1.length;
            }
            // .@@## or .@@@ case
            else {
                result.minimumSignificantDigits = g1.length;
                result.maximumSignificantDigits =
                    g1.length + (typeof g2 === 'string' ? g2.length : 0);
            }
            return '';
        });
        return result;
    }
    function parseSign(str) {
        switch (str) {
            case 'sign-auto':
                return {
                    signDisplay: 'auto',
                };
            case 'sign-accounting':
            case '()':
                return {
                    currencySign: 'accounting',
                };
            case 'sign-always':
            case '+!':
                return {
                    signDisplay: 'always',
                };
            case 'sign-accounting-always':
            case '()!':
                return {
                    signDisplay: 'always',
                    currencySign: 'accounting',
                };
            case 'sign-except-zero':
            case '+?':
                return {
                    signDisplay: 'exceptZero',
                };
            case 'sign-accounting-except-zero':
            case '()?':
                return {
                    signDisplay: 'exceptZero',
                    currencySign: 'accounting',
                };
            case 'sign-never':
            case '+_':
                return {
                    signDisplay: 'never',
                };
        }
    }
    function parseConciseScientificAndEngineeringStem(stem) {
        // Engineering
        var result;
        if (stem[0] === 'E' && stem[1] === 'E') {
            result = {
                notation: 'engineering',
            };
            stem = stem.slice(2);
        }
        else if (stem[0] === 'E') {
            result = {
                notation: 'scientific',
            };
            stem = stem.slice(1);
        }
        if (result) {
            var signDisplay = stem.slice(0, 2);
            if (signDisplay === '+!') {
                result.signDisplay = 'always';
                stem = stem.slice(2);
            }
            else if (signDisplay === '+?') {
                result.signDisplay = 'exceptZero';
                stem = stem.slice(2);
            }
            if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
                throw new Error('Malformed concise eng/scientific notation');
            }
            result.minimumIntegerDigits = stem.length;
        }
        return result;
    }
    function parseNotationOptions(opt) {
        var result = {};
        var signOpts = parseSign(opt);
        if (signOpts) {
            return signOpts;
        }
        return result;
    }
    /**
     * https://github.com/unicode-org/icu/blob/master/docs/userguide/format_parse/numbers/skeletons.md#skeleton-stems-and-options
     */
    function parseNumberSkeleton(tokens) {
        var result = {};
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            switch (token.stem) {
                case 'percent':
                case '%':
                    result.style = 'percent';
                    continue;
                case '%x100':
                    result.style = 'percent';
                    result.scale = 100;
                    continue;
                case 'currency':
                    result.style = 'currency';
                    result.currency = token.options[0];
                    continue;
                case 'group-off':
                case ',_':
                    result.useGrouping = false;
                    continue;
                case 'precision-integer':
                case '.':
                    result.maximumFractionDigits = 0;
                    continue;
                case 'measure-unit':
                case 'unit':
                    result.style = 'unit';
                    result.unit = icuUnitToEcma(token.options[0]);
                    continue;
                case 'compact-short':
                case 'K':
                    result.notation = 'compact';
                    result.compactDisplay = 'short';
                    continue;
                case 'compact-long':
                case 'KK':
                    result.notation = 'compact';
                    result.compactDisplay = 'long';
                    continue;
                case 'scientific':
                    result = __assign(__assign(__assign({}, result), { notation: 'scientific' }), token.options.reduce(function (all, opt) { return (__assign(__assign({}, all), parseNotationOptions(opt))); }, {}));
                    continue;
                case 'engineering':
                    result = __assign(__assign(__assign({}, result), { notation: 'engineering' }), token.options.reduce(function (all, opt) { return (__assign(__assign({}, all), parseNotationOptions(opt))); }, {}));
                    continue;
                case 'notation-simple':
                    result.notation = 'standard';
                    continue;
                // https://github.com/unicode-org/icu/blob/master/icu4c/source/i18n/unicode/unumberformatter.h
                case 'unit-width-narrow':
                    result.currencyDisplay = 'narrowSymbol';
                    result.unitDisplay = 'narrow';
                    continue;
                case 'unit-width-short':
                    result.currencyDisplay = 'code';
                    result.unitDisplay = 'short';
                    continue;
                case 'unit-width-full-name':
                    result.currencyDisplay = 'name';
                    result.unitDisplay = 'long';
                    continue;
                case 'unit-width-iso-code':
                    result.currencyDisplay = 'symbol';
                    continue;
                case 'scale':
                    result.scale = parseFloat(token.options[0]);
                    continue;
                // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
                case 'integer-width':
                    if (token.options.length > 1) {
                        throw new RangeError('integer-width stems only accept a single optional option');
                    }
                    token.options[0].replace(INTEGER_WIDTH_REGEX, function (_, g1, g2, g3, g4, g5) {
                        if (g1) {
                            result.minimumIntegerDigits = g2.length;
                        }
                        else if (g3 && g4) {
                            throw new Error('We currently do not support maximum integer digits');
                        }
                        else if (g5) {
                            throw new Error('We currently do not support exact integer digits');
                        }
                        return '';
                    });
                    continue;
            }
            // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
            if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
                result.minimumIntegerDigits = token.stem.length;
                continue;
            }
            if (FRACTION_PRECISION_REGEX.test(token.stem)) {
                // Precision
                // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#fraction-precision
                // precision-integer case
                if (token.options.length > 1) {
                    throw new RangeError('Fraction-precision stems only accept a single optional option');
                }
                token.stem.replace(FRACTION_PRECISION_REGEX, function (_, g1, g2, g3, g4, g5) {
                    // .000* case (before ICU67 it was .000+)
                    if (g2 === '*') {
                        result.minimumFractionDigits = g1.length;
                    }
                    // .### case
                    else if (g3 && g3[0] === '#') {
                        result.maximumFractionDigits = g3.length;
                    }
                    // .00## case
                    else if (g4 && g5) {
                        result.minimumFractionDigits = g4.length;
                        result.maximumFractionDigits = g4.length + g5.length;
                    }
                    else {
                        result.minimumFractionDigits = g1.length;
                        result.maximumFractionDigits = g1.length;
                    }
                    return '';
                });
                if (token.options.length) {
                    result = __assign(__assign({}, result), parseSignificantPrecision(token.options[0]));
                }
                continue;
            }
            // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#significant-digits-precision
            if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
                result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
                continue;
            }
            var signOpts = parseSign(token.stem);
            if (signOpts) {
                result = __assign(__assign({}, result), signOpts);
            }
            var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
            if (conciseScientificAndEngineeringOpts) {
                result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
            }
        }
        return result;
    }

    var _a;
    var SPACE_SEPARATOR_START_REGEX = new RegExp("^" + SPACE_SEPARATOR_REGEX.source + "*");
    var SPACE_SEPARATOR_END_REGEX = new RegExp(SPACE_SEPARATOR_REGEX.source + "*$");
    function createLocation(start, end) {
        return { start: start, end: end };
    }
    // #region Ponyfills
    // Consolidate these variables up top for easier toggling during debugging
    var hasNativeStartsWith = !!String.prototype.startsWith;
    var hasNativeFromCodePoint = !!String.fromCodePoint;
    var hasNativeFromEntries = !!Object.fromEntries;
    var hasNativeCodePointAt = !!String.prototype.codePointAt;
    var hasTrimStart = !!String.prototype.trimStart;
    var hasTrimEnd = !!String.prototype.trimEnd;
    var hasNativeIsSafeInteger = !!Number.isSafeInteger;
    var isSafeInteger = hasNativeIsSafeInteger
        ? Number.isSafeInteger
        : function (n) {
            return (typeof n === 'number' &&
                isFinite(n) &&
                Math.floor(n) === n &&
                Math.abs(n) <= 0x1fffffffffffff);
        };
    // IE11 does not support y and u.
    var REGEX_SUPPORTS_U_AND_Y = true;
    try {
        var re = RE('([^\\p{White_Space}\\p{Pattern_Syntax}]*)', 'yu');
        /**
         * legacy Edge or Xbox One browser
         * Unicode flag support: supported
         * Pattern_Syntax support: not supported
         * See https://github.com/formatjs/formatjs/issues/2822
         */
        REGEX_SUPPORTS_U_AND_Y = ((_a = re.exec('a')) === null || _a === void 0 ? void 0 : _a[0]) === 'a';
    }
    catch (_) {
        REGEX_SUPPORTS_U_AND_Y = false;
    }
    var startsWith = hasNativeStartsWith
        ? // Native
            function startsWith(s, search, position) {
                return s.startsWith(search, position);
            }
        : // For IE11
            function startsWith(s, search, position) {
                return s.slice(position, position + search.length) === search;
            };
    var fromCodePoint = hasNativeFromCodePoint
        ? String.fromCodePoint
        : // IE11
            function fromCodePoint() {
                var codePoints = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    codePoints[_i] = arguments[_i];
                }
                var elements = '';
                var length = codePoints.length;
                var i = 0;
                var code;
                while (length > i) {
                    code = codePoints[i++];
                    if (code > 0x10ffff)
                        throw RangeError(code + ' is not a valid code point');
                    elements +=
                        code < 0x10000
                            ? String.fromCharCode(code)
                            : String.fromCharCode(((code -= 0x10000) >> 10) + 0xd800, (code % 0x400) + 0xdc00);
                }
                return elements;
            };
    var fromEntries = 
    // native
    hasNativeFromEntries
        ? Object.fromEntries
        : // Ponyfill
            function fromEntries(entries) {
                var obj = {};
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var _a = entries_1[_i], k = _a[0], v = _a[1];
                    obj[k] = v;
                }
                return obj;
            };
    var codePointAt = hasNativeCodePointAt
        ? // Native
            function codePointAt(s, index) {
                return s.codePointAt(index);
            }
        : // IE 11
            function codePointAt(s, index) {
                var size = s.length;
                if (index < 0 || index >= size) {
                    return undefined;
                }
                var first = s.charCodeAt(index);
                var second;
                return first < 0xd800 ||
                    first > 0xdbff ||
                    index + 1 === size ||
                    (second = s.charCodeAt(index + 1)) < 0xdc00 ||
                    second > 0xdfff
                    ? first
                    : ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
            };
    var trimStart = hasTrimStart
        ? // Native
            function trimStart(s) {
                return s.trimStart();
            }
        : // Ponyfill
            function trimStart(s) {
                return s.replace(SPACE_SEPARATOR_START_REGEX, '');
            };
    var trimEnd = hasTrimEnd
        ? // Native
            function trimEnd(s) {
                return s.trimEnd();
            }
        : // Ponyfill
            function trimEnd(s) {
                return s.replace(SPACE_SEPARATOR_END_REGEX, '');
            };
    // Prevent minifier to translate new RegExp to literal form that might cause syntax error on IE11.
    function RE(s, flag) {
        return new RegExp(s, flag);
    }
    // #endregion
    var matchIdentifierAtIndex;
    if (REGEX_SUPPORTS_U_AND_Y) {
        // Native
        var IDENTIFIER_PREFIX_RE_1 = RE('([^\\p{White_Space}\\p{Pattern_Syntax}]*)', 'yu');
        matchIdentifierAtIndex = function matchIdentifierAtIndex(s, index) {
            var _a;
            IDENTIFIER_PREFIX_RE_1.lastIndex = index;
            var match = IDENTIFIER_PREFIX_RE_1.exec(s);
            return (_a = match[1]) !== null && _a !== void 0 ? _a : '';
        };
    }
    else {
        // IE11
        matchIdentifierAtIndex = function matchIdentifierAtIndex(s, index) {
            var match = [];
            while (true) {
                var c = codePointAt(s, index);
                if (c === undefined || _isWhiteSpace(c) || _isPatternSyntax(c)) {
                    break;
                }
                match.push(c);
                index += c >= 0x10000 ? 2 : 1;
            }
            return fromCodePoint.apply(void 0, match);
        };
    }
    var Parser$2 = /** @class */ (function () {
        function Parser(message, options) {
            if (options === void 0) { options = {}; }
            this.message = message;
            this.position = { offset: 0, line: 1, column: 1 };
            this.ignoreTag = !!options.ignoreTag;
            this.requiresOtherClause = !!options.requiresOtherClause;
            this.shouldParseSkeletons = !!options.shouldParseSkeletons;
        }
        Parser.prototype.parse = function () {
            if (this.offset() !== 0) {
                throw Error('parser can only be used once');
            }
            return this.parseMessage(0, '', false);
        };
        Parser.prototype.parseMessage = function (nestingLevel, parentArgType, expectingCloseTag) {
            var elements = [];
            while (!this.isEOF()) {
                var char = this.char();
                if (char === 123 /* `{` */) {
                    var result = this.parseArgument(nestingLevel, expectingCloseTag);
                    if (result.err) {
                        return result;
                    }
                    elements.push(result.val);
                }
                else if (char === 125 /* `}` */ && nestingLevel > 0) {
                    break;
                }
                else if (char === 35 /* `#` */ &&
                    (parentArgType === 'plural' || parentArgType === 'selectordinal')) {
                    var position = this.clonePosition();
                    this.bump();
                    elements.push({
                        type: TYPE.pound,
                        location: createLocation(position, this.clonePosition()),
                    });
                }
                else if (char === 60 /* `<` */ &&
                    !this.ignoreTag &&
                    this.peek() === 47 // char code for '/'
                ) {
                    if (expectingCloseTag) {
                        break;
                    }
                    else {
                        return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
                    }
                }
                else if (char === 60 /* `<` */ &&
                    !this.ignoreTag &&
                    _isAlpha(this.peek() || 0)) {
                    var result = this.parseTag(nestingLevel, parentArgType);
                    if (result.err) {
                        return result;
                    }
                    elements.push(result.val);
                }
                else {
                    var result = this.parseLiteral(nestingLevel, parentArgType);
                    if (result.err) {
                        return result;
                    }
                    elements.push(result.val);
                }
            }
            return { val: elements, err: null };
        };
        /**
         * A tag name must start with an ASCII lower/upper case letter. The grammar is based on the
         * [custom element name][] except that a dash is NOT always mandatory and uppercase letters
         * are accepted:
         *
         * ```
         * tag ::= "<" tagName (whitespace)* "/>" | "<" tagName (whitespace)* ">" message "</" tagName (whitespace)* ">"
         * tagName ::= [a-z] (PENChar)*
         * PENChar ::=
         *     "-" | "." | [0-9] | "_" | [a-z] | [A-Z] | #xB7 | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x37D] |
         *     [#x37F-#x1FFF] | [#x200C-#x200D] | [#x203F-#x2040] | [#x2070-#x218F] | [#x2C00-#x2FEF] |
         *     [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
         * ```
         *
         * [custom element name]: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
         * NOTE: We're a bit more lax here since HTML technically does not allow uppercase HTML element but we do
         * since other tag-based engines like React allow it
         */
        Parser.prototype.parseTag = function (nestingLevel, parentArgType) {
            var startPosition = this.clonePosition();
            this.bump(); // `<`
            var tagName = this.parseTagName();
            this.bumpSpace();
            if (this.bumpIf('/>')) {
                // Self closing tag
                return {
                    val: {
                        type: TYPE.literal,
                        value: "<" + tagName + "/>",
                        location: createLocation(startPosition, this.clonePosition()),
                    },
                    err: null,
                };
            }
            else if (this.bumpIf('>')) {
                var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
                if (childrenResult.err) {
                    return childrenResult;
                }
                var children = childrenResult.val;
                // Expecting a close tag
                var endTagStartPosition = this.clonePosition();
                if (this.bumpIf('</')) {
                    if (this.isEOF() || !_isAlpha(this.char())) {
                        return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
                    }
                    var closingTagNameStartPosition = this.clonePosition();
                    var closingTagName = this.parseTagName();
                    if (tagName !== closingTagName) {
                        return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
                    }
                    this.bumpSpace();
                    if (!this.bumpIf('>')) {
                        return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
                    }
                    return {
                        val: {
                            type: TYPE.tag,
                            value: tagName,
                            children: children,
                            location: createLocation(startPosition, this.clonePosition()),
                        },
                        err: null,
                    };
                }
                else {
                    return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
                }
            }
            else {
                return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
            }
        };
        /**
         * This method assumes that the caller has peeked ahead for the first tag character.
         */
        Parser.prototype.parseTagName = function () {
            var startOffset = this.offset();
            this.bump(); // the first tag name character
            while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
                this.bump();
            }
            return this.message.slice(startOffset, this.offset());
        };
        Parser.prototype.parseLiteral = function (nestingLevel, parentArgType) {
            var start = this.clonePosition();
            var value = '';
            while (true) {
                var parseQuoteResult = this.tryParseQuote(parentArgType);
                if (parseQuoteResult) {
                    value += parseQuoteResult;
                    continue;
                }
                var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
                if (parseUnquotedResult) {
                    value += parseUnquotedResult;
                    continue;
                }
                var parseLeftAngleResult = this.tryParseLeftAngleBracket();
                if (parseLeftAngleResult) {
                    value += parseLeftAngleResult;
                    continue;
                }
                break;
            }
            var location = createLocation(start, this.clonePosition());
            return {
                val: { type: TYPE.literal, value: value, location: location },
                err: null,
            };
        };
        Parser.prototype.tryParseLeftAngleBracket = function () {
            if (!this.isEOF() &&
                this.char() === 60 /* `<` */ &&
                (this.ignoreTag ||
                    // If at the opening tag or closing tag position, bail.
                    !_isAlphaOrSlash(this.peek() || 0))) {
                this.bump(); // `<`
                return '<';
            }
            return null;
        };
        /**
         * Starting with ICU 4.8, an ASCII apostrophe only starts quoted text if it immediately precedes
         * a character that requires quoting (that is, "only where needed"), and works the same in
         * nested messages as on the top level of the pattern. The new behavior is otherwise compatible.
         */
        Parser.prototype.tryParseQuote = function (parentArgType) {
            if (this.isEOF() || this.char() !== 39 /* `'` */) {
                return null;
            }
            // Parse escaped char following the apostrophe, or early return if there is no escaped char.
            // Check if is valid escaped character
            switch (this.peek()) {
                case 39 /* `'` */:
                    // double quote, should return as a single quote.
                    this.bump();
                    this.bump();
                    return "'";
                // '{', '<', '>', '}'
                case 123:
                case 60:
                case 62:
                case 125:
                    break;
                case 35: // '#'
                    if (parentArgType === 'plural' || parentArgType === 'selectordinal') {
                        break;
                    }
                    return null;
                default:
                    return null;
            }
            this.bump(); // apostrophe
            var codePoints = [this.char()]; // escaped char
            this.bump();
            // read chars until the optional closing apostrophe is found
            while (!this.isEOF()) {
                var ch = this.char();
                if (ch === 39 /* `'` */) {
                    if (this.peek() === 39 /* `'` */) {
                        codePoints.push(39);
                        // Bump one more time because we need to skip 2 characters.
                        this.bump();
                    }
                    else {
                        // Optional closing apostrophe.
                        this.bump();
                        break;
                    }
                }
                else {
                    codePoints.push(ch);
                }
                this.bump();
            }
            return fromCodePoint.apply(void 0, codePoints);
        };
        Parser.prototype.tryParseUnquoted = function (nestingLevel, parentArgType) {
            if (this.isEOF()) {
                return null;
            }
            var ch = this.char();
            if (ch === 60 /* `<` */ ||
                ch === 123 /* `{` */ ||
                (ch === 35 /* `#` */ &&
                    (parentArgType === 'plural' || parentArgType === 'selectordinal')) ||
                (ch === 125 /* `}` */ && nestingLevel > 0)) {
                return null;
            }
            else {
                this.bump();
                return fromCodePoint(ch);
            }
        };
        Parser.prototype.parseArgument = function (nestingLevel, expectingCloseTag) {
            var openingBracePosition = this.clonePosition();
            this.bump(); // `{`
            this.bumpSpace();
            if (this.isEOF()) {
                return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
            }
            if (this.char() === 125 /* `}` */) {
                this.bump();
                return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
            }
            // argument name
            var value = this.parseIdentifierIfPossible().value;
            if (!value) {
                return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
            }
            this.bumpSpace();
            if (this.isEOF()) {
                return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
            }
            switch (this.char()) {
                // Simple argument: `{name}`
                case 125 /* `}` */: {
                    this.bump(); // `}`
                    return {
                        val: {
                            type: TYPE.argument,
                            // value does not include the opening and closing braces.
                            value: value,
                            location: createLocation(openingBracePosition, this.clonePosition()),
                        },
                        err: null,
                    };
                }
                // Argument with options: `{name, format, ...}`
                case 44 /* `,` */: {
                    this.bump(); // `,`
                    this.bumpSpace();
                    if (this.isEOF()) {
                        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
                    }
                    return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
                }
                default:
                    return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
            }
        };
        /**
         * Advance the parser until the end of the identifier, if it is currently on
         * an identifier character. Return an empty string otherwise.
         */
        Parser.prototype.parseIdentifierIfPossible = function () {
            var startingPosition = this.clonePosition();
            var startOffset = this.offset();
            var value = matchIdentifierAtIndex(this.message, startOffset);
            var endOffset = startOffset + value.length;
            this.bumpTo(endOffset);
            var endPosition = this.clonePosition();
            var location = createLocation(startingPosition, endPosition);
            return { value: value, location: location };
        };
        Parser.prototype.parseArgumentOptions = function (nestingLevel, expectingCloseTag, value, openingBracePosition) {
            var _a;
            // Parse this range:
            // {name, type, style}
            //        ^---^
            var typeStartPosition = this.clonePosition();
            var argType = this.parseIdentifierIfPossible().value;
            var typeEndPosition = this.clonePosition();
            switch (argType) {
                case '':
                    // Expecting a style string number, date, time, plural, selectordinal, or select.
                    return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
                case 'number':
                case 'date':
                case 'time': {
                    // Parse this range:
                    // {name, number, style}
                    //              ^-------^
                    this.bumpSpace();
                    var styleAndLocation = null;
                    if (this.bumpIf(',')) {
                        this.bumpSpace();
                        var styleStartPosition = this.clonePosition();
                        var result = this.parseSimpleArgStyleIfPossible();
                        if (result.err) {
                            return result;
                        }
                        var style = trimEnd(result.val);
                        if (style.length === 0) {
                            return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
                        }
                        var styleLocation = createLocation(styleStartPosition, this.clonePosition());
                        styleAndLocation = { style: style, styleLocation: styleLocation };
                    }
                    var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                    if (argCloseResult.err) {
                        return argCloseResult;
                    }
                    var location_1 = createLocation(openingBracePosition, this.clonePosition());
                    // Extract style or skeleton
                    if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, '::', 0)) {
                        // Skeleton starts with `::`.
                        var skeleton = trimStart(styleAndLocation.style.slice(2));
                        if (argType === 'number') {
                            var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
                            if (result.err) {
                                return result;
                            }
                            return {
                                val: { type: TYPE.number, value: value, location: location_1, style: result.val },
                                err: null,
                            };
                        }
                        else {
                            if (skeleton.length === 0) {
                                return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
                            }
                            var style = {
                                type: SKELETON_TYPE.dateTime,
                                pattern: skeleton,
                                location: styleAndLocation.styleLocation,
                                parsedOptions: this.shouldParseSkeletons
                                    ? parseDateTimeSkeleton(skeleton)
                                    : {},
                            };
                            var type = argType === 'date' ? TYPE.date : TYPE.time;
                            return {
                                val: { type: type, value: value, location: location_1, style: style },
                                err: null,
                            };
                        }
                    }
                    // Regular style or no style.
                    return {
                        val: {
                            type: argType === 'number'
                                ? TYPE.number
                                : argType === 'date'
                                    ? TYPE.date
                                    : TYPE.time,
                            value: value,
                            location: location_1,
                            style: (_a = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a !== void 0 ? _a : null,
                        },
                        err: null,
                    };
                }
                case 'plural':
                case 'selectordinal':
                case 'select': {
                    // Parse this range:
                    // {name, plural, options}
                    //              ^---------^
                    var typeEndPosition_1 = this.clonePosition();
                    this.bumpSpace();
                    if (!this.bumpIf(',')) {
                        return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
                    }
                    this.bumpSpace();
                    // Parse offset:
                    // {name, plural, offset:1, options}
                    //                ^-----^
                    //
                    // or the first option:
                    //
                    // {name, plural, one {...} other {...}}
                    //                ^--^
                    var identifierAndLocation = this.parseIdentifierIfPossible();
                    var pluralOffset = 0;
                    if (argType !== 'select' && identifierAndLocation.value === 'offset') {
                        if (!this.bumpIf(':')) {
                            return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
                        }
                        this.bumpSpace();
                        var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
                        if (result.err) {
                            return result;
                        }
                        // Parse another identifier for option parsing
                        this.bumpSpace();
                        identifierAndLocation = this.parseIdentifierIfPossible();
                        pluralOffset = result.val;
                    }
                    var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
                    if (optionsResult.err) {
                        return optionsResult;
                    }
                    var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                    if (argCloseResult.err) {
                        return argCloseResult;
                    }
                    var location_2 = createLocation(openingBracePosition, this.clonePosition());
                    if (argType === 'select') {
                        return {
                            val: {
                                type: TYPE.select,
                                value: value,
                                options: fromEntries(optionsResult.val),
                                location: location_2,
                            },
                            err: null,
                        };
                    }
                    else {
                        return {
                            val: {
                                type: TYPE.plural,
                                value: value,
                                options: fromEntries(optionsResult.val),
                                offset: pluralOffset,
                                pluralType: argType === 'plural' ? 'cardinal' : 'ordinal',
                                location: location_2,
                            },
                            err: null,
                        };
                    }
                }
                default:
                    return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
            }
        };
        Parser.prototype.tryParseArgumentClose = function (openingBracePosition) {
            // Parse: {value, number, ::currency/GBP }
            //
            if (this.isEOF() || this.char() !== 125 /* `}` */) {
                return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
            }
            this.bump(); // `}`
            return { val: true, err: null };
        };
        /**
         * See: https://github.com/unicode-org/icu/blob/af7ed1f6d2298013dc303628438ec4abe1f16479/icu4c/source/common/messagepattern.cpp#L659
         */
        Parser.prototype.parseSimpleArgStyleIfPossible = function () {
            var nestedBraces = 0;
            var startPosition = this.clonePosition();
            while (!this.isEOF()) {
                var ch = this.char();
                switch (ch) {
                    case 39 /* `'` */: {
                        // Treat apostrophe as quoting but include it in the style part.
                        // Find the end of the quoted literal text.
                        this.bump();
                        var apostrophePosition = this.clonePosition();
                        if (!this.bumpUntil("'")) {
                            return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
                        }
                        this.bump();
                        break;
                    }
                    case 123 /* `{` */: {
                        nestedBraces += 1;
                        this.bump();
                        break;
                    }
                    case 125 /* `}` */: {
                        if (nestedBraces > 0) {
                            nestedBraces -= 1;
                        }
                        else {
                            return {
                                val: this.message.slice(startPosition.offset, this.offset()),
                                err: null,
                            };
                        }
                        break;
                    }
                    default:
                        this.bump();
                        break;
                }
            }
            return {
                val: this.message.slice(startPosition.offset, this.offset()),
                err: null,
            };
        };
        Parser.prototype.parseNumberSkeletonFromString = function (skeleton, location) {
            var tokens = [];
            try {
                tokens = parseNumberSkeletonFromString(skeleton);
            }
            catch (e) {
                return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location);
            }
            return {
                val: {
                    type: SKELETON_TYPE.number,
                    tokens: tokens,
                    location: location,
                    parsedOptions: this.shouldParseSkeletons
                        ? parseNumberSkeleton(tokens)
                        : {},
                },
                err: null,
            };
        };
        /**
         * @param nesting_level The current nesting level of messages.
         *     This can be positive when parsing message fragment in select or plural argument options.
         * @param parent_arg_type The parent argument's type.
         * @param parsed_first_identifier If provided, this is the first identifier-like selector of
         *     the argument. It is a by-product of a previous parsing attempt.
         * @param expecting_close_tag If true, this message is directly or indirectly nested inside
         *     between a pair of opening and closing tags. The nested message will not parse beyond
         *     the closing tag boundary.
         */
        Parser.prototype.tryParsePluralOrSelectOptions = function (nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
            var _a;
            var hasOtherClause = false;
            var options = [];
            var parsedSelectors = new Set();
            var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
            // Parse:
            // one {one apple}
            // ^--^
            while (true) {
                if (selector.length === 0) {
                    var startPosition = this.clonePosition();
                    if (parentArgType !== 'select' && this.bumpIf('=')) {
                        // Try parse `={number}` selector
                        var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
                        if (result.err) {
                            return result;
                        }
                        selectorLocation = createLocation(startPosition, this.clonePosition());
                        selector = this.message.slice(startPosition.offset, this.offset());
                    }
                    else {
                        break;
                    }
                }
                // Duplicate selector clauses
                if (parsedSelectors.has(selector)) {
                    return this.error(parentArgType === 'select'
                        ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR
                        : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
                }
                if (selector === 'other') {
                    hasOtherClause = true;
                }
                // Parse:
                // one {one apple}
                //     ^----------^
                this.bumpSpace();
                var openingBracePosition = this.clonePosition();
                if (!this.bumpIf('{')) {
                    return this.error(parentArgType === 'select'
                        ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT
                        : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
                }
                var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
                if (fragmentResult.err) {
                    return fragmentResult;
                }
                var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                if (argCloseResult.err) {
                    return argCloseResult;
                }
                options.push([
                    selector,
                    {
                        value: fragmentResult.val,
                        location: createLocation(openingBracePosition, this.clonePosition()),
                    },
                ]);
                // Keep track of the existing selectors
                parsedSelectors.add(selector);
                // Prep next selector clause.
                this.bumpSpace();
                (_a = this.parseIdentifierIfPossible(), selector = _a.value, selectorLocation = _a.location);
            }
            if (options.length === 0) {
                return this.error(parentArgType === 'select'
                    ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR
                    : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
            }
            if (this.requiresOtherClause && !hasOtherClause) {
                return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
            }
            return { val: options, err: null };
        };
        Parser.prototype.tryParseDecimalInteger = function (expectNumberError, invalidNumberError) {
            var sign = 1;
            var startingPosition = this.clonePosition();
            if (this.bumpIf('+')) ;
            else if (this.bumpIf('-')) {
                sign = -1;
            }
            var hasDigits = false;
            var decimal = 0;
            while (!this.isEOF()) {
                var ch = this.char();
                if (ch >= 48 /* `0` */ && ch <= 57 /* `9` */) {
                    hasDigits = true;
                    decimal = decimal * 10 + (ch - 48);
                    this.bump();
                }
                else {
                    break;
                }
            }
            var location = createLocation(startingPosition, this.clonePosition());
            if (!hasDigits) {
                return this.error(expectNumberError, location);
            }
            decimal *= sign;
            if (!isSafeInteger(decimal)) {
                return this.error(invalidNumberError, location);
            }
            return { val: decimal, err: null };
        };
        Parser.prototype.offset = function () {
            return this.position.offset;
        };
        Parser.prototype.isEOF = function () {
            return this.offset() === this.message.length;
        };
        Parser.prototype.clonePosition = function () {
            // This is much faster than `Object.assign` or spread.
            return {
                offset: this.position.offset,
                line: this.position.line,
                column: this.position.column,
            };
        };
        /**
         * Return the code point at the current position of the parser.
         * Throws if the index is out of bound.
         */
        Parser.prototype.char = function () {
            var offset = this.position.offset;
            if (offset >= this.message.length) {
                throw Error('out of bound');
            }
            var code = codePointAt(this.message, offset);
            if (code === undefined) {
                throw Error("Offset " + offset + " is at invalid UTF-16 code unit boundary");
            }
            return code;
        };
        Parser.prototype.error = function (kind, location) {
            return {
                val: null,
                err: {
                    kind: kind,
                    message: this.message,
                    location: location,
                },
            };
        };
        /** Bump the parser to the next UTF-16 code unit. */
        Parser.prototype.bump = function () {
            if (this.isEOF()) {
                return;
            }
            var code = this.char();
            if (code === 10 /* '\n' */) {
                this.position.line += 1;
                this.position.column = 1;
                this.position.offset += 1;
            }
            else {
                this.position.column += 1;
                // 0 ~ 0x10000 -> unicode BMP, otherwise skip the surrogate pair.
                this.position.offset += code < 0x10000 ? 1 : 2;
            }
        };
        /**
         * If the substring starting at the current position of the parser has
         * the given prefix, then bump the parser to the character immediately
         * following the prefix and return true. Otherwise, don't bump the parser
         * and return false.
         */
        Parser.prototype.bumpIf = function (prefix) {
            if (startsWith(this.message, prefix, this.offset())) {
                for (var i = 0; i < prefix.length; i++) {
                    this.bump();
                }
                return true;
            }
            return false;
        };
        /**
         * Bump the parser until the pattern character is found and return `true`.
         * Otherwise bump to the end of the file and return `false`.
         */
        Parser.prototype.bumpUntil = function (pattern) {
            var currentOffset = this.offset();
            var index = this.message.indexOf(pattern, currentOffset);
            if (index >= 0) {
                this.bumpTo(index);
                return true;
            }
            else {
                this.bumpTo(this.message.length);
                return false;
            }
        };
        /**
         * Bump the parser to the target offset.
         * If target offset is beyond the end of the input, bump the parser to the end of the input.
         */
        Parser.prototype.bumpTo = function (targetOffset) {
            if (this.offset() > targetOffset) {
                throw Error("targetOffset " + targetOffset + " must be greater than or equal to the current offset " + this.offset());
            }
            targetOffset = Math.min(targetOffset, this.message.length);
            while (true) {
                var offset = this.offset();
                if (offset === targetOffset) {
                    break;
                }
                if (offset > targetOffset) {
                    throw Error("targetOffset " + targetOffset + " is at invalid UTF-16 code unit boundary");
                }
                this.bump();
                if (this.isEOF()) {
                    break;
                }
            }
        };
        /** advance the parser through all whitespace to the next non-whitespace code unit. */
        Parser.prototype.bumpSpace = function () {
            while (!this.isEOF() && _isWhiteSpace(this.char())) {
                this.bump();
            }
        };
        /**
         * Peek at the *next* Unicode codepoint in the input without advancing the parser.
         * If the input has been exhausted, then this returns null.
         */
        Parser.prototype.peek = function () {
            if (this.isEOF()) {
                return null;
            }
            var code = this.char();
            var offset = this.offset();
            var nextCode = this.message.charCodeAt(offset + (code >= 0x10000 ? 2 : 1));
            return nextCode !== null && nextCode !== void 0 ? nextCode : null;
        };
        return Parser;
    }());
    /**
     * This check if codepoint is alphabet (lower & uppercase)
     * @param codepoint
     * @returns
     */
    function _isAlpha(codepoint) {
        return ((codepoint >= 97 && codepoint <= 122) ||
            (codepoint >= 65 && codepoint <= 90));
    }
    function _isAlphaOrSlash(codepoint) {
        return _isAlpha(codepoint) || codepoint === 47; /* '/' */
    }
    /** See `parseTag` function docs. */
    function _isPotentialElementNameChar(c) {
        return (c === 45 /* '-' */ ||
            c === 46 /* '.' */ ||
            (c >= 48 && c <= 57) /* 0..9 */ ||
            c === 95 /* '_' */ ||
            (c >= 97 && c <= 122) /** a..z */ ||
            (c >= 65 && c <= 90) /* A..Z */ ||
            c == 0xb7 ||
            (c >= 0xc0 && c <= 0xd6) ||
            (c >= 0xd8 && c <= 0xf6) ||
            (c >= 0xf8 && c <= 0x37d) ||
            (c >= 0x37f && c <= 0x1fff) ||
            (c >= 0x200c && c <= 0x200d) ||
            (c >= 0x203f && c <= 0x2040) ||
            (c >= 0x2070 && c <= 0x218f) ||
            (c >= 0x2c00 && c <= 0x2fef) ||
            (c >= 0x3001 && c <= 0xd7ff) ||
            (c >= 0xf900 && c <= 0xfdcf) ||
            (c >= 0xfdf0 && c <= 0xfffd) ||
            (c >= 0x10000 && c <= 0xeffff));
    }
    /**
     * Code point equivalent of regex `\p{White_Space}`.
     * From: https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
     */
    function _isWhiteSpace(c) {
        return ((c >= 0x0009 && c <= 0x000d) ||
            c === 0x0020 ||
            c === 0x0085 ||
            (c >= 0x200e && c <= 0x200f) ||
            c === 0x2028 ||
            c === 0x2029);
    }
    /**
     * Code point equivalent of regex `\p{Pattern_Syntax}`.
     * See https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
     */
    function _isPatternSyntax(c) {
        return ((c >= 0x0021 && c <= 0x0023) ||
            c === 0x0024 ||
            (c >= 0x0025 && c <= 0x0027) ||
            c === 0x0028 ||
            c === 0x0029 ||
            c === 0x002a ||
            c === 0x002b ||
            c === 0x002c ||
            c === 0x002d ||
            (c >= 0x002e && c <= 0x002f) ||
            (c >= 0x003a && c <= 0x003b) ||
            (c >= 0x003c && c <= 0x003e) ||
            (c >= 0x003f && c <= 0x0040) ||
            c === 0x005b ||
            c === 0x005c ||
            c === 0x005d ||
            c === 0x005e ||
            c === 0x0060 ||
            c === 0x007b ||
            c === 0x007c ||
            c === 0x007d ||
            c === 0x007e ||
            c === 0x00a1 ||
            (c >= 0x00a2 && c <= 0x00a5) ||
            c === 0x00a6 ||
            c === 0x00a7 ||
            c === 0x00a9 ||
            c === 0x00ab ||
            c === 0x00ac ||
            c === 0x00ae ||
            c === 0x00b0 ||
            c === 0x00b1 ||
            c === 0x00b6 ||
            c === 0x00bb ||
            c === 0x00bf ||
            c === 0x00d7 ||
            c === 0x00f7 ||
            (c >= 0x2010 && c <= 0x2015) ||
            (c >= 0x2016 && c <= 0x2017) ||
            c === 0x2018 ||
            c === 0x2019 ||
            c === 0x201a ||
            (c >= 0x201b && c <= 0x201c) ||
            c === 0x201d ||
            c === 0x201e ||
            c === 0x201f ||
            (c >= 0x2020 && c <= 0x2027) ||
            (c >= 0x2030 && c <= 0x2038) ||
            c === 0x2039 ||
            c === 0x203a ||
            (c >= 0x203b && c <= 0x203e) ||
            (c >= 0x2041 && c <= 0x2043) ||
            c === 0x2044 ||
            c === 0x2045 ||
            c === 0x2046 ||
            (c >= 0x2047 && c <= 0x2051) ||
            c === 0x2052 ||
            c === 0x2053 ||
            (c >= 0x2055 && c <= 0x205e) ||
            (c >= 0x2190 && c <= 0x2194) ||
            (c >= 0x2195 && c <= 0x2199) ||
            (c >= 0x219a && c <= 0x219b) ||
            (c >= 0x219c && c <= 0x219f) ||
            c === 0x21a0 ||
            (c >= 0x21a1 && c <= 0x21a2) ||
            c === 0x21a3 ||
            (c >= 0x21a4 && c <= 0x21a5) ||
            c === 0x21a6 ||
            (c >= 0x21a7 && c <= 0x21ad) ||
            c === 0x21ae ||
            (c >= 0x21af && c <= 0x21cd) ||
            (c >= 0x21ce && c <= 0x21cf) ||
            (c >= 0x21d0 && c <= 0x21d1) ||
            c === 0x21d2 ||
            c === 0x21d3 ||
            c === 0x21d4 ||
            (c >= 0x21d5 && c <= 0x21f3) ||
            (c >= 0x21f4 && c <= 0x22ff) ||
            (c >= 0x2300 && c <= 0x2307) ||
            c === 0x2308 ||
            c === 0x2309 ||
            c === 0x230a ||
            c === 0x230b ||
            (c >= 0x230c && c <= 0x231f) ||
            (c >= 0x2320 && c <= 0x2321) ||
            (c >= 0x2322 && c <= 0x2328) ||
            c === 0x2329 ||
            c === 0x232a ||
            (c >= 0x232b && c <= 0x237b) ||
            c === 0x237c ||
            (c >= 0x237d && c <= 0x239a) ||
            (c >= 0x239b && c <= 0x23b3) ||
            (c >= 0x23b4 && c <= 0x23db) ||
            (c >= 0x23dc && c <= 0x23e1) ||
            (c >= 0x23e2 && c <= 0x2426) ||
            (c >= 0x2427 && c <= 0x243f) ||
            (c >= 0x2440 && c <= 0x244a) ||
            (c >= 0x244b && c <= 0x245f) ||
            (c >= 0x2500 && c <= 0x25b6) ||
            c === 0x25b7 ||
            (c >= 0x25b8 && c <= 0x25c0) ||
            c === 0x25c1 ||
            (c >= 0x25c2 && c <= 0x25f7) ||
            (c >= 0x25f8 && c <= 0x25ff) ||
            (c >= 0x2600 && c <= 0x266e) ||
            c === 0x266f ||
            (c >= 0x2670 && c <= 0x2767) ||
            c === 0x2768 ||
            c === 0x2769 ||
            c === 0x276a ||
            c === 0x276b ||
            c === 0x276c ||
            c === 0x276d ||
            c === 0x276e ||
            c === 0x276f ||
            c === 0x2770 ||
            c === 0x2771 ||
            c === 0x2772 ||
            c === 0x2773 ||
            c === 0x2774 ||
            c === 0x2775 ||
            (c >= 0x2794 && c <= 0x27bf) ||
            (c >= 0x27c0 && c <= 0x27c4) ||
            c === 0x27c5 ||
            c === 0x27c6 ||
            (c >= 0x27c7 && c <= 0x27e5) ||
            c === 0x27e6 ||
            c === 0x27e7 ||
            c === 0x27e8 ||
            c === 0x27e9 ||
            c === 0x27ea ||
            c === 0x27eb ||
            c === 0x27ec ||
            c === 0x27ed ||
            c === 0x27ee ||
            c === 0x27ef ||
            (c >= 0x27f0 && c <= 0x27ff) ||
            (c >= 0x2800 && c <= 0x28ff) ||
            (c >= 0x2900 && c <= 0x2982) ||
            c === 0x2983 ||
            c === 0x2984 ||
            c === 0x2985 ||
            c === 0x2986 ||
            c === 0x2987 ||
            c === 0x2988 ||
            c === 0x2989 ||
            c === 0x298a ||
            c === 0x298b ||
            c === 0x298c ||
            c === 0x298d ||
            c === 0x298e ||
            c === 0x298f ||
            c === 0x2990 ||
            c === 0x2991 ||
            c === 0x2992 ||
            c === 0x2993 ||
            c === 0x2994 ||
            c === 0x2995 ||
            c === 0x2996 ||
            c === 0x2997 ||
            c === 0x2998 ||
            (c >= 0x2999 && c <= 0x29d7) ||
            c === 0x29d8 ||
            c === 0x29d9 ||
            c === 0x29da ||
            c === 0x29db ||
            (c >= 0x29dc && c <= 0x29fb) ||
            c === 0x29fc ||
            c === 0x29fd ||
            (c >= 0x29fe && c <= 0x2aff) ||
            (c >= 0x2b00 && c <= 0x2b2f) ||
            (c >= 0x2b30 && c <= 0x2b44) ||
            (c >= 0x2b45 && c <= 0x2b46) ||
            (c >= 0x2b47 && c <= 0x2b4c) ||
            (c >= 0x2b4d && c <= 0x2b73) ||
            (c >= 0x2b74 && c <= 0x2b75) ||
            (c >= 0x2b76 && c <= 0x2b95) ||
            c === 0x2b96 ||
            (c >= 0x2b97 && c <= 0x2bff) ||
            (c >= 0x2e00 && c <= 0x2e01) ||
            c === 0x2e02 ||
            c === 0x2e03 ||
            c === 0x2e04 ||
            c === 0x2e05 ||
            (c >= 0x2e06 && c <= 0x2e08) ||
            c === 0x2e09 ||
            c === 0x2e0a ||
            c === 0x2e0b ||
            c === 0x2e0c ||
            c === 0x2e0d ||
            (c >= 0x2e0e && c <= 0x2e16) ||
            c === 0x2e17 ||
            (c >= 0x2e18 && c <= 0x2e19) ||
            c === 0x2e1a ||
            c === 0x2e1b ||
            c === 0x2e1c ||
            c === 0x2e1d ||
            (c >= 0x2e1e && c <= 0x2e1f) ||
            c === 0x2e20 ||
            c === 0x2e21 ||
            c === 0x2e22 ||
            c === 0x2e23 ||
            c === 0x2e24 ||
            c === 0x2e25 ||
            c === 0x2e26 ||
            c === 0x2e27 ||
            c === 0x2e28 ||
            c === 0x2e29 ||
            (c >= 0x2e2a && c <= 0x2e2e) ||
            c === 0x2e2f ||
            (c >= 0x2e30 && c <= 0x2e39) ||
            (c >= 0x2e3a && c <= 0x2e3b) ||
            (c >= 0x2e3c && c <= 0x2e3f) ||
            c === 0x2e40 ||
            c === 0x2e41 ||
            c === 0x2e42 ||
            (c >= 0x2e43 && c <= 0x2e4f) ||
            (c >= 0x2e50 && c <= 0x2e51) ||
            c === 0x2e52 ||
            (c >= 0x2e53 && c <= 0x2e7f) ||
            (c >= 0x3001 && c <= 0x3003) ||
            c === 0x3008 ||
            c === 0x3009 ||
            c === 0x300a ||
            c === 0x300b ||
            c === 0x300c ||
            c === 0x300d ||
            c === 0x300e ||
            c === 0x300f ||
            c === 0x3010 ||
            c === 0x3011 ||
            (c >= 0x3012 && c <= 0x3013) ||
            c === 0x3014 ||
            c === 0x3015 ||
            c === 0x3016 ||
            c === 0x3017 ||
            c === 0x3018 ||
            c === 0x3019 ||
            c === 0x301a ||
            c === 0x301b ||
            c === 0x301c ||
            c === 0x301d ||
            (c >= 0x301e && c <= 0x301f) ||
            c === 0x3020 ||
            c === 0x3030 ||
            c === 0xfd3e ||
            c === 0xfd3f ||
            (c >= 0xfe45 && c <= 0xfe46));
    }

    function pruneLocation(els) {
        els.forEach(function (el) {
            delete el.location;
            if (isSelectElement(el) || isPluralElement(el)) {
                for (var k in el.options) {
                    delete el.options[k].location;
                    pruneLocation(el.options[k].value);
                }
            }
            else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
                delete el.style.location;
            }
            else if ((isDateElement(el) || isTimeElement(el)) &&
                isDateTimeSkeleton(el.style)) {
                delete el.style.location;
            }
            else if (isTagElement(el)) {
                pruneLocation(el.children);
            }
        });
    }
    function parse$2(message, opts) {
        if (opts === void 0) { opts = {}; }
        opts = __assign({ shouldParseSkeletons: true, requiresOtherClause: true }, opts);
        var result = new Parser$2(message, opts).parse();
        if (result.err) {
            var error = SyntaxError(ErrorKind[result.err.kind]);
            // @ts-expect-error Assign to error object
            error.location = result.err.location;
            // @ts-expect-error Assign to error object
            error.originalMessage = result.err.message;
            throw error;
        }
        if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
            pruneLocation(result.val);
        }
        return result.val;
    }

    //
    // Main
    //
    function memoize(fn, options) {
        var cache = options && options.cache ? options.cache : cacheDefault;
        var serializer = options && options.serializer ? options.serializer : serializerDefault;
        var strategy = options && options.strategy ? options.strategy : strategyDefault;
        return strategy(fn, {
            cache: cache,
            serializer: serializer,
        });
    }
    //
    // Strategy
    //
    function isPrimitive(value) {
        return (value == null || typeof value === 'number' || typeof value === 'boolean'); // || typeof value === "string" 'unsafe' primitive for our needs
    }
    function monadic(fn, cache, serializer, arg) {
        var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
        var computedValue = cache.get(cacheKey);
        if (typeof computedValue === 'undefined') {
            computedValue = fn.call(this, arg);
            cache.set(cacheKey, computedValue);
        }
        return computedValue;
    }
    function variadic(fn, cache, serializer) {
        var args = Array.prototype.slice.call(arguments, 3);
        var cacheKey = serializer(args);
        var computedValue = cache.get(cacheKey);
        if (typeof computedValue === 'undefined') {
            computedValue = fn.apply(this, args);
            cache.set(cacheKey, computedValue);
        }
        return computedValue;
    }
    function assemble(fn, context, strategy, cache, serialize) {
        return strategy.bind(context, fn, cache, serialize);
    }
    function strategyDefault(fn, options) {
        var strategy = fn.length === 1 ? monadic : variadic;
        return assemble(fn, this, strategy, options.cache.create(), options.serializer);
    }
    function strategyVariadic(fn, options) {
        return assemble(fn, this, variadic, options.cache.create(), options.serializer);
    }
    function strategyMonadic(fn, options) {
        return assemble(fn, this, monadic, options.cache.create(), options.serializer);
    }
    //
    // Serializer
    //
    var serializerDefault = function () {
        return JSON.stringify(arguments);
    };
    //
    // Cache
    //
    function ObjectWithoutPrototypeCache() {
        this.cache = Object.create(null);
    }
    ObjectWithoutPrototypeCache.prototype.has = function (key) {
        return key in this.cache;
    };
    ObjectWithoutPrototypeCache.prototype.get = function (key) {
        return this.cache[key];
    };
    ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
        this.cache[key] = value;
    };
    var cacheDefault = {
        create: function create() {
            // @ts-ignore
            return new ObjectWithoutPrototypeCache();
        },
    };
    var strategies = {
        variadic: strategyVariadic,
        monadic: strategyMonadic,
    };

    var ErrorCode;
    (function (ErrorCode) {
        // When we have a placeholder but no value to format
        ErrorCode["MISSING_VALUE"] = "MISSING_VALUE";
        // When value supplied is invalid
        ErrorCode["INVALID_VALUE"] = "INVALID_VALUE";
        // When we need specific Intl API but it's not available
        ErrorCode["MISSING_INTL_API"] = "MISSING_INTL_API";
    })(ErrorCode || (ErrorCode = {}));
    var FormatError = /** @class */ (function (_super) {
        __extends(FormatError, _super);
        function FormatError(msg, code, originalMessage) {
            var _this = _super.call(this, msg) || this;
            _this.code = code;
            _this.originalMessage = originalMessage;
            return _this;
        }
        FormatError.prototype.toString = function () {
            return "[formatjs Error: " + this.code + "] " + this.message;
        };
        return FormatError;
    }(Error));
    var InvalidValueError = /** @class */ (function (_super) {
        __extends(InvalidValueError, _super);
        function InvalidValueError(variableId, value, options, originalMessage) {
            return _super.call(this, "Invalid values for \"" + variableId + "\": \"" + value + "\". Options are \"" + Object.keys(options).join('", "') + "\"", ErrorCode.INVALID_VALUE, originalMessage) || this;
        }
        return InvalidValueError;
    }(FormatError));
    var InvalidValueTypeError = /** @class */ (function (_super) {
        __extends(InvalidValueTypeError, _super);
        function InvalidValueTypeError(value, type, originalMessage) {
            return _super.call(this, "Value for \"" + value + "\" must be of type " + type, ErrorCode.INVALID_VALUE, originalMessage) || this;
        }
        return InvalidValueTypeError;
    }(FormatError));
    var MissingValueError = /** @class */ (function (_super) {
        __extends(MissingValueError, _super);
        function MissingValueError(variableId, originalMessage) {
            return _super.call(this, "The intl string context variable \"" + variableId + "\" was not provided to the string \"" + originalMessage + "\"", ErrorCode.MISSING_VALUE, originalMessage) || this;
        }
        return MissingValueError;
    }(FormatError));

    var PART_TYPE;
    (function (PART_TYPE) {
        PART_TYPE[PART_TYPE["literal"] = 0] = "literal";
        PART_TYPE[PART_TYPE["object"] = 1] = "object";
    })(PART_TYPE || (PART_TYPE = {}));
    function mergeLiteral(parts) {
        if (parts.length < 2) {
            return parts;
        }
        return parts.reduce(function (all, part) {
            var lastPart = all[all.length - 1];
            if (!lastPart ||
                lastPart.type !== PART_TYPE.literal ||
                part.type !== PART_TYPE.literal) {
                all.push(part);
            }
            else {
                lastPart.value += part.value;
            }
            return all;
        }, []);
    }
    function isFormatXMLElementFn(el) {
        return typeof el === 'function';
    }
    // TODO(skeleton): add skeleton support
    function formatToParts(els, locales, formatters, formats, values, currentPluralValue, 
    // For debugging
    originalMessage) {
        // Hot path for straight simple msg translations
        if (els.length === 1 && isLiteralElement(els[0])) {
            return [
                {
                    type: PART_TYPE.literal,
                    value: els[0].value,
                },
            ];
        }
        var result = [];
        for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
            var el = els_1[_i];
            // Exit early for string parts.
            if (isLiteralElement(el)) {
                result.push({
                    type: PART_TYPE.literal,
                    value: el.value,
                });
                continue;
            }
            // TODO: should this part be literal type?
            // Replace `#` in plural rules with the actual numeric value.
            if (isPoundElement(el)) {
                if (typeof currentPluralValue === 'number') {
                    result.push({
                        type: PART_TYPE.literal,
                        value: formatters.getNumberFormat(locales).format(currentPluralValue),
                    });
                }
                continue;
            }
            var varName = el.value;
            // Enforce that all required values are provided by the caller.
            if (!(values && varName in values)) {
                throw new MissingValueError(varName, originalMessage);
            }
            var value = values[varName];
            if (isArgumentElement(el)) {
                if (!value || typeof value === 'string' || typeof value === 'number') {
                    value =
                        typeof value === 'string' || typeof value === 'number'
                            ? String(value)
                            : '';
                }
                result.push({
                    type: typeof value === 'string' ? PART_TYPE.literal : PART_TYPE.object,
                    value: value,
                });
                continue;
            }
            // Recursively format plural and select parts' option — which can be a
            // nested pattern structure. The choosing of the option to use is
            // abstracted-by and delegated-to the part helper object.
            if (isDateElement(el)) {
                var style = typeof el.style === 'string'
                    ? formats.date[el.style]
                    : isDateTimeSkeleton(el.style)
                        ? el.style.parsedOptions
                        : undefined;
                result.push({
                    type: PART_TYPE.literal,
                    value: formatters
                        .getDateTimeFormat(locales, style)
                        .format(value),
                });
                continue;
            }
            if (isTimeElement(el)) {
                var style = typeof el.style === 'string'
                    ? formats.time[el.style]
                    : isDateTimeSkeleton(el.style)
                        ? el.style.parsedOptions
                        : undefined;
                result.push({
                    type: PART_TYPE.literal,
                    value: formatters
                        .getDateTimeFormat(locales, style)
                        .format(value),
                });
                continue;
            }
            if (isNumberElement(el)) {
                var style = typeof el.style === 'string'
                    ? formats.number[el.style]
                    : isNumberSkeleton(el.style)
                        ? el.style.parsedOptions
                        : undefined;
                if (style && style.scale) {
                    value =
                        value *
                            (style.scale || 1);
                }
                result.push({
                    type: PART_TYPE.literal,
                    value: formatters
                        .getNumberFormat(locales, style)
                        .format(value),
                });
                continue;
            }
            if (isTagElement(el)) {
                var children = el.children, value_1 = el.value;
                var formatFn = values[value_1];
                if (!isFormatXMLElementFn(formatFn)) {
                    throw new InvalidValueTypeError(value_1, 'function', originalMessage);
                }
                var parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
                var chunks = formatFn(parts.map(function (p) { return p.value; }));
                if (!Array.isArray(chunks)) {
                    chunks = [chunks];
                }
                result.push.apply(result, chunks.map(function (c) {
                    return {
                        type: typeof c === 'string' ? PART_TYPE.literal : PART_TYPE.object,
                        value: c,
                    };
                }));
            }
            if (isSelectElement(el)) {
                var opt = el.options[value] || el.options.other;
                if (!opt) {
                    throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
                }
                result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values));
                continue;
            }
            if (isPluralElement(el)) {
                var opt = el.options["=" + value];
                if (!opt) {
                    if (!Intl.PluralRules) {
                        throw new FormatError("Intl.PluralRules is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-pluralrules\"\n", ErrorCode.MISSING_INTL_API, originalMessage);
                    }
                    var rule = formatters
                        .getPluralRules(locales, { type: el.pluralType })
                        .select(value - (el.offset || 0));
                    opt = el.options[rule] || el.options.other;
                }
                if (!opt) {
                    throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
                }
                result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
                continue;
            }
        }
        return mergeLiteral(result);
    }

    /*
    Copyright (c) 2014, Yahoo! Inc. All rights reserved.
    Copyrights licensed under the New BSD License.
    See the accompanying LICENSE file for terms.
    */
    // -- MessageFormat --------------------------------------------------------
    function mergeConfig(c1, c2) {
        if (!c2) {
            return c1;
        }
        return __assign(__assign(__assign({}, (c1 || {})), (c2 || {})), Object.keys(c1).reduce(function (all, k) {
            all[k] = __assign(__assign({}, c1[k]), (c2[k] || {}));
            return all;
        }, {}));
    }
    function mergeConfigs(defaultConfig, configs) {
        if (!configs) {
            return defaultConfig;
        }
        return Object.keys(defaultConfig).reduce(function (all, k) {
            all[k] = mergeConfig(defaultConfig[k], configs[k]);
            return all;
        }, __assign({}, defaultConfig));
    }
    function createFastMemoizeCache(store) {
        return {
            create: function () {
                return {
                    has: function (key) {
                        return key in store;
                    },
                    get: function (key) {
                        return store[key];
                    },
                    set: function (key, value) {
                        store[key] = value;
                    },
                };
            },
        };
    }
    function createDefaultFormatters(cache) {
        if (cache === void 0) { cache = {
            number: {},
            dateTime: {},
            pluralRules: {},
        }; }
        return {
            getNumberFormat: memoize(function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return new ((_a = Intl.NumberFormat).bind.apply(_a, __spreadArray([void 0], args)))();
            }, {
                cache: createFastMemoizeCache(cache.number),
                strategy: strategies.variadic,
            }),
            getDateTimeFormat: memoize(function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return new ((_a = Intl.DateTimeFormat).bind.apply(_a, __spreadArray([void 0], args)))();
            }, {
                cache: createFastMemoizeCache(cache.dateTime),
                strategy: strategies.variadic,
            }),
            getPluralRules: memoize(function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return new ((_a = Intl.PluralRules).bind.apply(_a, __spreadArray([void 0], args)))();
            }, {
                cache: createFastMemoizeCache(cache.pluralRules),
                strategy: strategies.variadic,
            }),
        };
    }
    var IntlMessageFormat = /** @class */ (function () {
        function IntlMessageFormat(message, locales, overrideFormats, opts) {
            var _this = this;
            if (locales === void 0) { locales = IntlMessageFormat.defaultLocale; }
            this.formatterCache = {
                number: {},
                dateTime: {},
                pluralRules: {},
            };
            this.format = function (values) {
                var parts = _this.formatToParts(values);
                // Hot path for straight simple msg translations
                if (parts.length === 1) {
                    return parts[0].value;
                }
                var result = parts.reduce(function (all, part) {
                    if (!all.length ||
                        part.type !== PART_TYPE.literal ||
                        typeof all[all.length - 1] !== 'string') {
                        all.push(part.value);
                    }
                    else {
                        all[all.length - 1] += part.value;
                    }
                    return all;
                }, []);
                if (result.length <= 1) {
                    return result[0] || '';
                }
                return result;
            };
            this.formatToParts = function (values) {
                return formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, undefined, _this.message);
            };
            this.resolvedOptions = function () { return ({
                locale: Intl.NumberFormat.supportedLocalesOf(_this.locales)[0],
            }); };
            this.getAst = function () { return _this.ast; };
            if (typeof message === 'string') {
                this.message = message;
                if (!IntlMessageFormat.__parse) {
                    throw new TypeError('IntlMessageFormat.__parse must be set to process `message` of type `string`');
                }
                // Parse string messages into an AST.
                this.ast = IntlMessageFormat.__parse(message, {
                    ignoreTag: opts === null || opts === void 0 ? void 0 : opts.ignoreTag,
                });
            }
            else {
                this.ast = message;
            }
            if (!Array.isArray(this.ast)) {
                throw new TypeError('A message must be provided as a String or AST.');
            }
            // Creates a new object with the specified `formats` merged with the default
            // formats.
            this.formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
            // Defined first because it's used to build the format pattern.
            this.locales = locales;
            this.formatters =
                (opts && opts.formatters) || createDefaultFormatters(this.formatterCache);
        }
        Object.defineProperty(IntlMessageFormat, "defaultLocale", {
            get: function () {
                if (!IntlMessageFormat.memoizedDefaultLocale) {
                    IntlMessageFormat.memoizedDefaultLocale =
                        new Intl.NumberFormat().resolvedOptions().locale;
                }
                return IntlMessageFormat.memoizedDefaultLocale;
            },
            enumerable: false,
            configurable: true
        });
        IntlMessageFormat.memoizedDefaultLocale = null;
        IntlMessageFormat.__parse = parse$2;
        // Default format options used as the prototype of the `formats` provided to the
        // constructor. These are used when constructing the internal Intl.NumberFormat
        // and Intl.DateTimeFormat instances.
        IntlMessageFormat.formats = {
            number: {
                integer: {
                    maximumFractionDigits: 0,
                },
                currency: {
                    style: 'currency',
                },
                percent: {
                    style: 'percent',
                },
            },
            date: {
                short: {
                    month: 'numeric',
                    day: 'numeric',
                    year: '2-digit',
                },
                medium: {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                },
                long: {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                },
                full: {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                },
            },
            time: {
                short: {
                    hour: 'numeric',
                    minute: 'numeric',
                },
                medium: {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                },
                long: {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short',
                },
                full: {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short',
                },
            },
        };
        return IntlMessageFormat;
    }());

    const r={},i=(e,n,t)=>t?(n in r||(r[n]={}),e in r[n]||(r[n][e]=t),t):t,a=(e,n)=>{if(null==n)return;if(n in r&&e in r[n])return r[n][e];const t=E(n);for(let o=0;o<t.length;o++){const r=c(t[o],e);if(r)return i(e,n,r)}};let l;const s=writable({});function u(e){return e in l}function c(e,n){if(!u(e))return null;return function(e,n){if(n in e)return e[n];const t=n.split(".");let o=e;for(let e=0;e<t.length;e++)if("object"==typeof o){if(e>0){const n=t.slice(e,t.length).join(".");if(n in o){o=o[n];break}}o=o[t[e]];}else o=void 0;return o}(function(e){return l[e]||null}(e),n)}function m(e,...n){delete r[e],s.update((o=>(o[e]=cjs.all([o[e]||{},...n]),o)));}derived([s],(([e])=>Object.keys(e)));s.subscribe((e=>l=e));const d={};function g(e){return d[e]}function w$1(e){return E(e).some((e=>{var n;return null===(n=g(e))||void 0===n?void 0:n.size}))}function h(e,n){return Promise.all(n.map((n=>(function(e,n){d[e].delete(n),0===d[e].size&&delete d[e];}(e,n),n().then((e=>e.default||e)))))).then((n=>m(e,...n)))}const p={};function b(e){if(!w$1(e))return e in p?p[e]:void 0;const n=function(e){return E(e).map((e=>{const n=g(e);return [e,n?[...n]:[]]})).filter((([,e])=>e.length>0))}(e);return p[e]=Promise.all(n.map((([e,n])=>h(e,n)))).then((()=>{if(w$1(e))return b(e);delete p[e];})),p[e]}/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */function v(e,n){var t={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)n.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(t[o[r]]=e[o[r]]);}return t}const O={fallbackLocale:null,initialLocale:null,loadingDelay:200,formats:{number:{scientific:{notation:"scientific"},engineering:{notation:"engineering"},compactLong:{notation:"compact",compactDisplay:"long"},compactShort:{notation:"compact",compactDisplay:"short"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},warnOnMissingMessages:!0,ignoreTag:!0};function j(){return O}function $(e){const{formats:n}=e,t=v(e,["formats"]),o=e.initialLocale||e.fallbackLocale;return Object.assign(O,t,{initialLocale:o}),n&&("number"in n&&Object.assign(O.formats.number,n.number),"date"in n&&Object.assign(O.formats.date,n.date),"time"in n&&Object.assign(O.formats.time,n.time)),T.set(o)}const k=writable(!1);let L;const T=writable(null);function x(e){return e.split("-").map(((e,n,t)=>t.slice(0,n+1).join("-"))).reverse()}function E(e,n=j().fallbackLocale){const t=x(e);return n?[...new Set([...t,...x(n)])]:t}function D(){return L}T.subscribe((e=>{L=e,"undefined"!=typeof window&&null!==e&&document.documentElement.setAttribute("lang",e);}));const M=T.set;T.set=e=>{if(function(e){if(null==e)return;const n=E(e);for(let e=0;e<n.length;e++){const t=n[e];if(u(t))return t}}(e)&&w$1(e)){const{loadingDelay:n}=j();let t;return "undefined"!=typeof window&&null!=D()&&n?t=window.setTimeout((()=>k.set(!0)),n):k.set(!0),b(e).then((()=>{M(e);})).finally((()=>{clearTimeout(t),k.set(!1);}))}return M(e)},T.update=e=>M(e(L));const I=()=>"undefined"==typeof window?null:window.navigator.language||window.navigator.languages[0],Z=e=>{const n=Object.create(null);return t=>{const o=JSON.stringify(t);return o in n?n[o]:n[o]=e(t)}},C=(e,n)=>{const{formats:t}=j();if(e in t&&n in t[e])return t[e][n];throw new Error(`[svelte-i18n] Unknown "${n}" ${e} format.`)},G=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format numbers');return t&&(o=C("number",t)),new Intl.NumberFormat(n,o)})),J=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format dates');return t?o=C("date",t):0===Object.keys(o).length&&(o=C("date","short")),new Intl.DateTimeFormat(n,o)})),U=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format time values');return t?o=C("time",t):0===Object.keys(o).length&&(o=C("time","short")),new Intl.DateTimeFormat(n,o)})),_=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return G(Object.assign({locale:n},t))},q=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return J(Object.assign({locale:n},t))},B=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return U(Object.assign({locale:n},t))},H=Z(((e,n=D())=>new IntlMessageFormat(e,n,j().formats,{ignoreTag:j().ignoreTag}))),K=(e,n={})=>{"object"==typeof e&&(e=(n=e).id);const{values:t,locale:o=D(),default:r}=n;if(null==o)throw new Error("[svelte-i18n] Cannot format a message without first setting the initial locale.");let i=a(e,o);if(i){if("string"!=typeof i)return console.warn(`[svelte-i18n] Message with id "${e}" must be of type "string", found: "${typeof i}". Gettin its value through the "$format" method is deprecated; use the "json" method instead.`),i}else j().warnOnMissingMessages&&console.warn(`[svelte-i18n] The message "${e}" was not found in "${E(o).join('", "')}".${w$1(D())?"\n\nNote: there are at least one loader still registered to this locale that wasn't executed.":""}`),i=r||e;if(!t)return i;let l=i;try{l=H(i,o).format(t);}catch(n){console.warn(`[svelte-i18n] Message "${e}" has syntax error:`,n.message);}return l},Q=(e,n)=>B(n).format(e),R=(e,n)=>q(n).format(e),V=(e,n)=>_(n).format(e),W=(e,n=D())=>a(e,n),X=derived([T,s],(()=>K));derived([T],(()=>Q));derived([T],(()=>R));derived([T],(()=>V));derived([T,s],(()=>W));

    var next$3="Next";var previous$3="Previous";var evaluate$3="Evaluate";var reset$3="One more time!";var hint$3="Show hint";var resultsTitle$3="Your quiz results";var resultsText$3="You have answered {points} out of {total} questions correctly!";var overviewTitle$1="Your Overall Results";var overviewText$1="Across all quizzes you have answered {overallPoints} out of {overallMaxPoints} questions correctly!";var en = {next:next$3,previous:previous$3,evaluate:evaluate$3,reset:reset$3,hint:hint$3,resultsTitle:resultsTitle$3,resultsText:resultsText$3,overviewTitle:overviewTitle$1,overviewText:overviewText$1};

    var next$2="Weiter";var previous$2="Zurück";var evaluate$2="Zum Ergebnis";var reset$2="Noch einmal!";var hint$2="Tipp anzeigen";var resultsTitle$2="Ihr Ergebnis";var resultsText$2="Sie haben {points} von {total} Fragen richtig beantwortet!";var overviewTitle="Zusammenfassung der Ergebnisse";var overviewText="Über alle Quiz hinweg haben Sie {overallPoints} von {overallMaxPoints} Fragen richtig beantwortet!";var de = {next:next$2,previous:previous$2,evaluate:evaluate$2,reset:reset$2,hint:hint$2,resultsTitle:resultsTitle$2,resultsText:resultsText$2,overviewTitle:overviewTitle,overviewText:overviewText};

    var next$1="Suivant";var previous$1="Précédent";var evaluate$1="Réponse";var reset$1="Recommencer!";var hint$1="Indice";var resultsTitle$1="Vos résultats";var resultsText$1="Vous avez répondu correctement à {points} questions sur {total}!";var fr = {next:next$1,previous:previous$1,evaluate:evaluate$1,reset:reset$1,hint:hint$1,resultsTitle:resultsTitle$1,resultsText:resultsText$1};

    var next="Siguiente";var previous="Anterior";var evaluate="Respuesta";var reset="Otra vez!";var hint="Pista";var resultsTitle="Resultados";var resultsText="Ha acertado a {points} preguntas de {total}!";var es = {next:next,previous:previous,evaluate:evaluate,reset:reset,hint:hint,resultsTitle:resultsTitle,resultsText:resultsText};

    function registerLanguages (locale) {
        m('de', de);
        m('en', en);
        m('fr', fr);
        m('es', es);
        $({
            fallbackLocale: 'en',
            initialLocale: locale === null ? I() : locale,
        });
    }

    /* src/components/Card.svelte generated by Svelte v3.44.1 */

    const file$e = "src/components/Card.svelte";

    function add_css$a(target) {
    	append_styles(target, "svelte-1b7k2af", ".card.svelte-1b7k2af{box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2);border-radius:0 0 4px 4px;margin-top:1rem}.card.svelte-1b7k2af:first-child{margin-top:0}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FyZC5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBQ0ksS0FBQSxlQUFBLENBQUEsQUFDSSxVQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUEwQyxDQUMxQyxhQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsR0FBMEIsQ0FDMUIsVUFBQSxDQUFBLElBQWdCLEFBQ3BCLENBQUEsQUFFQSxvQkFBQSxZQUFBLEFBQUEsQ0FBQSxBQUNJLFVBQUEsQ0FBQSxDQUFhLEFBQ2pCLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvQ2FyZC5zdmVsdGUiXX0= */");
    }

    function create_fragment$g(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-1b7k2af");
    			add_location(div, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$g, create_fragment$g, safe_not_equal, {}, add_css$a);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/components/Credits.svelte generated by Svelte v3.44.1 */

    const file$d = "src/components/Credits.svelte";

    function add_css$9(target) {
    	append_styles(target, "svelte-1ywdtbp", ".credits.svelte-1ywdtbp a.svelte-1ywdtbp{color:gray;text-decoration:none}.credits.svelte-1ywdtbp a.svelte-1ywdtbp:hover{text-decoration:underline}.credits.svelte-1ywdtbp.svelte-1ywdtbp{margin-top:1rem;font-size:small;text-align:end;color:lightgray}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlZGl0cy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBQ0ksdUJBQUEsQ0FBQSxDQUFBLGVBQUEsQ0FBQSxBQUNJLEtBQUEsQ0FBQSxJQUFXLENBQ1gsZUFBQSxDQUFBLElBQXFCLEFBQ3pCLENBQUEsQUFFQSx1QkFBQSxDQUFBLGdCQUFBLE1BQUEsQUFBQSxDQUFBLEFBQ0ksZUFBQSxDQUFBLFNBQTBCLEFBQzlCLENBQUEsQUFFQSxRQUFBLDhCQUFBLENBQUEsQUFDSSxVQUFBLENBQUEsSUFBZ0IsQ0FDaEIsU0FBQSxDQUFBLEtBQWdCLENBQ2hCLFVBQUEsQ0FBQSxHQUFlLENBQ2YsS0FBQSxDQUFBLFNBQWdCLEFBQ3BCLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvQ3JlZGl0cy5zdmVsdGUiXX0= */");
    }

    function create_fragment$f(ctx) {
    	let div;
    	let a;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			a.textContent = `quizdown ${'v0.5.0'}`;
    			attr_dev(a, "href", "https://github.com/bonartm/quizdown-js");
    			attr_dev(a, "class", "svelte-1ywdtbp");
    			add_location(a, file$d, 2, 4, 102);
    			attr_dev(div, "class", "credits svelte-1ywdtbp");
    			add_location(div, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    		},
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Credits', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Credits> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Credits extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$f, create_fragment$f, safe_not_equal, {}, add_css$9);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Credits",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/SmoothResize.svelte generated by Svelte v3.44.1 */
    const file$c = "src/components/SmoothResize.svelte";

    function create_fragment$e(ctx) {
    	let div1;
    	let div0;
    	let div0_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			add_render_callback(() => /*div0_elementresize_handler*/ ctx[7].call(div0));
    			add_location(div0, file$c, 18, 4, 428);
    			set_style(div1, "height", /*$height*/ ctx[1] + "px");
    			add_location(div1, file$c, 17, 0, 390);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			div0_resize_listener = add_resize_listener(div0, /*div0_elementresize_handler*/ ctx[7].bind(div0));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*$height*/ 2) {
    				set_style(div1, "height", /*$height*/ ctx[1] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			div0_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $height;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SmoothResize', slots, ['default']);
    	let { minHeight = 0 } = $$props;
    	let innerHeight;
    	const height = tweened(innerHeight, { duration: 100 });
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(1, $height = value));
    	let mounted = false;
    	onMount(() => $$invalidate(4, mounted = true));
    	const writable_props = ['minHeight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SmoothResize> was created with unknown prop '${key}'`);
    	});

    	function div0_elementresize_handler() {
    		innerHeight = this.clientHeight;
    		$$invalidate(0, innerHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('minHeight' in $$props) $$invalidate(3, minHeight = $$props.minHeight);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		cubicOut,
    		onMount,
    		minHeight,
    		innerHeight,
    		height,
    		mounted,
    		$height
    	});

    	$$self.$inject_state = $$props => {
    		if ('minHeight' in $$props) $$invalidate(3, minHeight = $$props.minHeight);
    		if ('innerHeight' in $$props) $$invalidate(0, innerHeight = $$props.innerHeight);
    		if ('mounted' in $$props) $$invalidate(4, mounted = $$props.mounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mounted, minHeight, innerHeight*/ 25) {
    			{
    				if (mounted) {
    					height.set(Math.max(minHeight, innerHeight));
    				}
    			}
    		}
    	};

    	return [
    		innerHeight,
    		$height,
    		height,
    		minHeight,
    		mounted,
    		$$scope,
    		slots,
    		div0_elementresize_handler
    	];
    }

    class SmoothResize extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$e, create_fragment$e, safe_not_equal, { minHeight: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SmoothResize",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get minHeight() {
    		throw new Error("<SmoothResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minHeight(value) {
    		throw new Error("<SmoothResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src/components/DragDropList.svelte generated by Svelte v3.44.1 */
    const file$b = "src/components/DragDropList.svelte";

    function add_css$8(target) {
    	append_styles(target, "svelte-wh4fgf", ".dragdroplist.svelte-wh4fgf.svelte-wh4fgf{position:relative;padding:0}.list.svelte-wh4fgf.svelte-wh4fgf{cursor:grab;z-index:5;display:flex;flex-direction:column}.item.svelte-wh4fgf.svelte-wh4fgf{box-sizing:border-box;display:inline-flex;width:100%;margin-bottom:0.5em;border-radius:2px;user-select:none;margin:5px;padding:0;background-color:var(--quizdown-color-secondary);border:3px solid transparent;color:var(--quizdown-color-text)}.item.svelte-wh4fgf.svelte-wh4fgf:last-child{margin-bottom:0}.item.svelte-wh4fgf.svelte-wh4fgf:not(#grabbed):not(#ghost){z-index:10}.item.svelte-wh4fgf>.svelte-wh4fgf{margin:auto auto auto 0}.buttons.svelte-wh4fgf.svelte-wh4fgf{width:32px;min-width:32px;margin:auto 0;display:flex;flex-direction:column}.buttons.svelte-wh4fgf button.svelte-wh4fgf{cursor:pointer;width:18px;height:18px;margin:0 auto;padding:0;border:1px solid rgba(0, 0, 0, 0);background-color:inherit}.buttons.svelte-wh4fgf button.svelte-wh4fgf:focus{border:1px solid black}.delete.svelte-wh4fgf.svelte-wh4fgf{width:32px}#grabbed.svelte-wh4fgf.svelte-wh4fgf{opacity:0}#ghost.svelte-wh4fgf.svelte-wh4fgf{pointer-events:none;z-index:-5;position:absolute;top:0;left:0;opacity:0;border:3px solid var(--quizdown-color-primary);background-color:var(--quizdown-color-secondary)}#ghost.svelte-wh4fgf .svelte-wh4fgf{pointer-events:none}#ghost.haunting.svelte-wh4fgf.svelte-wh4fgf{z-index:20;opacity:1}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJhZ0Ryb3BMaXN0LnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFDSSxhQUFBLDRCQUFBLENBQUEsQUFDSSxRQUFBLENBQUEsUUFBa0IsQ0FDbEIsT0FBQSxDQUFBLENBQVUsQUFDZCxDQUFBLEFBRUEsS0FBQSw0QkFBQSxDQUFBLEFBQ0ksTUFBQSxDQUFBLElBQVksQ0FDWixPQUFBLENBQUEsQ0FBVSxDQUNWLE9BQUEsQ0FBQSxJQUFhLENBQ2IsY0FBQSxDQUFBLE1BQXNCLEFBQzFCLENBQUEsQUFFQSxLQUFBLDRCQUFBLENBQUEsQUFDSSxVQUFBLENBQUEsVUFBc0IsQ0FDdEIsT0FBQSxDQUFBLFdBQW9CLENBQ3BCLEtBQUEsQ0FBQSxJQUFXLENBQ1gsYUFBQSxDQUFBLEtBQW9CLENBQ3BCLGFBQUEsQ0FBQSxHQUFrQixDQUNsQixXQUFBLENBQUEsSUFBaUIsQ0FDakIsTUFBQSxDQUFBLEdBQVcsQ0FDWCxPQUFBLENBQUEsQ0FBVSxDQUNWLGdCQUFBLENBQUEsSUFBQSwwQkFBQSxDQUFpRCxDQUNqRCxNQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxXQUE2QixDQUM3QixLQUFBLENBQUEsSUFBQSxxQkFBQSxDQUFpQyxBQUNyQyxDQUFBLEFBRUEsaUNBQUEsV0FBQSxBQUFBLENBQUEsQUFDSSxhQUFBLENBQUEsQ0FBZ0IsQUFDcEIsQ0FBQSxBQUVBLGlDQUFBLEtBQUEsUUFBQSxDQUFBLEtBQUEsTUFBQSxDQUFBLEFBQUEsQ0FBQSxBQUNJLE9BQUEsQ0FBQSxFQUFXLEFBQ2YsQ0FBQSxBQUVBLG1CQUFBLENBQUEsY0FBQSxDQUFBLEFBQ0ksTUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLENBQXdCLEFBQzVCLENBQUEsQUFFQSxRQUFBLDRCQUFBLENBQUEsQUFDSSxLQUFBLENBQUEsSUFBVyxDQUNYLFNBQUEsQ0FBQSxJQUFlLENBQ2YsTUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFjLENBQ2QsT0FBQSxDQUFBLElBQWEsQ0FDYixjQUFBLENBQUEsTUFBc0IsQUFDMUIsQ0FBQSxBQUVBLHNCQUFBLENBQUEsTUFBQSxjQUFBLENBQUEsQUFDSSxNQUFBLENBQUEsT0FBZSxDQUNmLEtBQUEsQ0FBQSxJQUFXLENBQ1gsTUFBQSxDQUFBLElBQVksQ0FDWixNQUFBLENBQUEsQ0FBQSxDQUFBLElBQWMsQ0FDZCxPQUFBLENBQUEsQ0FBVSxDQUNWLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFrQyxDQUNsQyxnQkFBQSxDQUFBLE9BQXlCLEFBQzdCLENBQUEsQUFFQSxzQkFBQSxDQUFBLG9CQUFBLE1BQUEsQUFBQSxDQUFBLEFBQ0ksTUFBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsS0FBdUIsQUFDM0IsQ0FBQSxBQUVBLE9BQUEsNEJBQUEsQ0FBQSxBQUNJLEtBQUEsQ0FBQSxJQUFXLEFBQ2YsQ0FBQSxBQUVBLFFBQUEsNEJBQUEsQ0FBQSxBQUNJLE9BQUEsQ0FBQSxDQUFVLEFBQ2QsQ0FBQSxBQUVBLE1BQUEsNEJBQUEsQ0FBQSxBQUNJLGNBQUEsQ0FBQSxJQUFvQixDQUNwQixPQUFBLENBQUEsRUFBVyxDQUNYLFFBQUEsQ0FBQSxRQUFrQixDQUNsQixHQUFBLENBQUEsQ0FBTSxDQUNOLElBQUEsQ0FBQSxDQUFPLENBQ1AsT0FBQSxDQUFBLENBQVUsQ0FDVixNQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLHdCQUFBLENBQStDLENBQy9DLGdCQUFBLENBQUEsSUFBQSwwQkFBQSxDQUFpRCxBQUNyRCxDQUFBLEFBRUEsb0JBQUEsQ0FBQSxjQUFBLENBQUEsQUFDSSxjQUFBLENBQUEsSUFBb0IsQUFDeEIsQ0FBQSxBQUVBLE1BQUEsU0FBQSw0QkFBQSxDQUFBLEFBQ0ksT0FBQSxDQUFBLEVBQVcsQ0FDWCxPQUFBLENBQUEsQ0FBVSxBQUNkLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvRHJhZ0Ryb3BMaXN0LnN2ZWx0ZSJdfQ== */");
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    // (171:20) {:else}
    function create_else_block$3(ctx) {
    	let p;
    	let t_value = /*datum*/ ctx[28] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(t_value);
    			add_location(p, file$b, 171, 24, 6008);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*datum*/ ctx[28] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(171:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (169:41) 
    function create_if_block_2$1(ctx) {
    	let p;
    	let t_value = /*datum*/ ctx[28].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(t_value);
    			add_location(p, file$b, 169, 24, 5936);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*datum*/ ctx[28].text + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(169:41) ",
    		ctx
    	});

    	return block;
    }

    // (167:20) {#if datum.html}
    function create_if_block_1$2(ctx) {
    	let html_tag;
    	let raw_value = /*datum*/ ctx[28].html + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && raw_value !== (raw_value = /*datum*/ ctx[28].html + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(167:20) {#if datum.html}",
    		ctx
    	});

    	return block;
    }

    // (177:20) {#if removesItems}
    function create_if_block$6(ctx) {
    	let button;
    	let svg;
    	let path0;
    	let path1;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[17](/*i*/ ctx[30], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$b, 187, 33, 6622);
    			attr_dev(path1, "d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    			add_location(path1, file$b, 188, 40, 6698);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "width", "16");
    			add_location(svg, file$b, 182, 28, 6378);
    			attr_dev(button, "class", "svelte-wh4fgf");
    			add_location(button, file$b, 177, 24, 6181);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(177:20) {#if removesItems}",
    		ctx
    	});

    	return block;
    }

    // (99:8) {#each data as datum, i (datum.id ? datum.id : JSON.stringify(datum))}
    function create_each_block$3(key_1, ctx) {
    	let div3;
    	let div0;
    	let button0;
    	let svg0;
    	let path0;
    	let path1;
    	let button0_style_value;
    	let t0;
    	let button1;
    	let svg1;
    	let path2;
    	let path3;
    	let button1_style_value;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3_id_value;
    	let div3_data_index_value;
    	let div3_data_id_value;
    	let rect;
    	let stop_animation = noop$2;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[15](/*i*/ ctx[30], ...args);
    	}

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[16](/*i*/ ctx[30], ...args);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*datum*/ ctx[28].html) return create_if_block_1$2;
    		if (/*datum*/ ctx[28].text) return create_if_block_2$1;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*removesItems*/ ctx[1] && create_if_block$6(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t0 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			t1 = space();
    			div1 = element("div");
    			if_block0.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			attr_dev(path0, "d", "M0 0h24v24H0V0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$b, 139, 29, 4627);
    			attr_dev(path1, "d", "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z");
    			add_location(path1, file$b, 139, 74, 4672);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "width", "16px");
    			attr_dev(svg0, "height", "16px");
    			add_location(svg0, file$b, 134, 24, 4399);
    			attr_dev(button0, "class", "up svelte-wh4fgf");
    			attr_dev(button0, "style", button0_style_value = 'visibility: ' + (/*i*/ ctx[30] > 0 ? '' : 'hidden') + ';');
    			add_location(button0, file$b, 127, 20, 4101);
    			attr_dev(path2, "d", "M0 0h24v24H0V0z");
    			attr_dev(path2, "fill", "none");
    			add_location(path2, file$b, 158, 29, 5487);
    			attr_dev(path3, "d", "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z");
    			add_location(path3, file$b, 158, 74, 5532);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "width", "16px");
    			attr_dev(svg1, "height", "16px");
    			add_location(svg1, file$b, 153, 24, 5259);
    			attr_dev(button1, "class", "down svelte-wh4fgf");

    			attr_dev(button1, "style", button1_style_value = 'visibility: ' + (/*i*/ ctx[30] < /*data*/ ctx[0].length - 1
    			? ''
    			: 'hidden') + ';');

    			add_location(button1, file$b, 144, 20, 4889);
    			attr_dev(div0, "class", "buttons svelte-wh4fgf");
    			add_location(div0, file$b, 126, 16, 4059);
    			attr_dev(div1, "class", "content svelte-wh4fgf");
    			add_location(div1, file$b, 165, 16, 5768);
    			attr_dev(div2, "class", "buttons delete svelte-wh4fgf");
    			add_location(div2, file$b, 175, 16, 6089);

    			attr_dev(div3, "id", div3_id_value = /*grabbed*/ ctx[3] && (/*datum*/ ctx[28].id
    			? /*datum*/ ctx[28].id
    			: JSON.stringify(/*datum*/ ctx[28])) == /*grabbed*/ ctx[3].dataset.id
    			? 'grabbed'
    			: '');

    			attr_dev(div3, "class", "item svelte-wh4fgf");
    			attr_dev(div3, "data-index", div3_data_index_value = /*i*/ ctx[30]);

    			attr_dev(div3, "data-id", div3_data_id_value = /*datum*/ ctx[28].id
    			? /*datum*/ ctx[28].id
    			: JSON.stringify(/*datum*/ ctx[28]));

    			attr_dev(div3, "data-graby", "0");
    			add_location(div3, file$b, 99, 12, 3026);
    			this.first = div3;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			append_dev(div0, t0);
    			append_dev(div0, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path2);
    			append_dev(svg1, path3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			if_block0.m(div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div3, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false),
    					listen_dev(div3, "mousedown", /*mousedown_handler*/ ctx[18], false, false, false),
    					listen_dev(div3, "touchstart", /*touchstart_handler*/ ctx[19], false, false, false),
    					listen_dev(div3, "mouseenter", /*mouseenter_handler*/ ctx[20], false, false, false),
    					listen_dev(div3, "touchmove", /*touchmove_handler*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*data*/ 1 && button0_style_value !== (button0_style_value = 'visibility: ' + (/*i*/ ctx[30] > 0 ? '' : 'hidden') + ';')) {
    				attr_dev(button0, "style", button0_style_value);
    			}

    			if (dirty & /*data*/ 1 && button1_style_value !== (button1_style_value = 'visibility: ' + (/*i*/ ctx[30] < /*data*/ ctx[0].length - 1
    			? ''
    			: 'hidden') + ';')) {
    				attr_dev(button1, "style", button1_style_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			}

    			if (/*removesItems*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*grabbed, data*/ 9 && div3_id_value !== (div3_id_value = /*grabbed*/ ctx[3] && (/*datum*/ ctx[28].id
    			? /*datum*/ ctx[28].id
    			: JSON.stringify(/*datum*/ ctx[28])) == /*grabbed*/ ctx[3].dataset.id
    			? 'grabbed'
    			: '')) {
    				attr_dev(div3, "id", div3_id_value);
    			}

    			if (dirty & /*data*/ 1 && div3_data_index_value !== (div3_data_index_value = /*i*/ ctx[30])) {
    				attr_dev(div3, "data-index", div3_data_index_value);
    			}

    			if (dirty & /*data*/ 1 && div3_data_id_value !== (div3_data_id_value = /*datum*/ ctx[28].id
    			? /*datum*/ ctx[28].id
    			: JSON.stringify(/*datum*/ ctx[28]))) {
    				attr_dev(div3, "data-id", div3_data_id_value);
    			}
    		},
    		r: function measure() {
    			rect = div3.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div3);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div3, rect, flip, { duration: 200 });
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(99:8) {#each data as datum, i (datum.id ? datum.id : JSON.stringify(datum))}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div2;
    	let div0;
    	let p;
    	let div0_class_value;
    	let div0_style_value;
    	let t;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let mounted;
    	let dispose;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);

    	const get_key = ctx => /*datum*/ ctx[28].id
    	? /*datum*/ ctx[28].id
    	: JSON.stringify(/*datum*/ ctx[28]);

    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "svelte-wh4fgf");
    			add_location(p, file$b, 73, 8, 2300);
    			attr_dev(div0, "id", "ghost");
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*grabbed*/ ctx[3] ? 'item haunting' : 'item') + " svelte-wh4fgf"));
    			attr_dev(div0, "style", div0_style_value = 'top: ' + (/*mouseY*/ ctx[4] + /*offsetY*/ ctx[5] - /*layerY*/ ctx[6]) + 'px');
    			add_location(div0, file$b, 67, 4, 2118);
    			attr_dev(div1, "class", "list svelte-wh4fgf");
    			add_location(div1, file$b, 75, 4, 2323);
    			attr_dev(div2, "class", "dragdroplist svelte-wh4fgf");
    			add_location(div2, file$b, 66, 0, 2087);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			/*div0_binding*/ ctx[14](div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mousemove", /*mousemove_handler*/ ctx[22], false, false, false),
    					listen_dev(div1, "touchmove", /*touchmove_handler_1*/ ctx[23], false, false, false),
    					listen_dev(div1, "mouseup", /*mouseup_handler*/ ctx[24], false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[25], false, false, false),
    					listen_dev(div1, "touchend", /*touchend_handler*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*grabbed*/ 8 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*grabbed*/ ctx[3] ? 'item haunting' : 'item') + " svelte-wh4fgf"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*mouseY, offsetY, layerY*/ 112 && div0_style_value !== (div0_style_value = 'top: ' + (/*mouseY*/ ctx[4] + /*offsetY*/ ctx[5] - /*layerY*/ ctx[6]) + 'px')) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*grabbed, data, JSON, grab, dragEnter, touchEnter, removeDatum, removesItems, moveDatum*/ 11915) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, fix_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*div0_binding*/ ctx[14](null);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DragDropList', slots, []);
    	let { data = [] } = $$props;
    	let { removesItems = false } = $$props;
    	let ghost;
    	let grabbed;
    	let lastTarget;
    	let mouseY = 0; // pointer y coordinate within client
    	let offsetY = 0; // y distance from top of grabbed element to pointer
    	let layerY = 0; // distance from top of list to top of client

    	function grab(clientY, element) {
    		// modify grabbed element
    		$$invalidate(3, grabbed = element);

    		$$invalidate(3, grabbed.dataset.grabY = String(clientY), grabbed);

    		// modify ghost element (which is actually dragged)
    		$$invalidate(2, ghost.innerHTML = grabbed.innerHTML, ghost);

    		// record offset from cursor to top of element
    		// (used for positioning ghost)
    		$$invalidate(5, offsetY = grabbed.getBoundingClientRect().y - clientY);

    		drag(clientY);
    	}

    	// drag handler updates cursor position
    	function drag(clientY) {
    		if (grabbed) {
    			$$invalidate(4, mouseY = clientY);
    			$$invalidate(6, layerY = ghost.parentElement.getBoundingClientRect().y);
    		}
    	}

    	// touchEnter handler emulates the mouseenter event for touch input
    	// (more or less)
    	function touchEnter(ev) {
    		drag(ev.clientY);

    		// trigger dragEnter the first time the cursor moves over a list item
    		let root = ghost.getRootNode();

    		let target = root.elementFromPoint(ev.clientX, ev.clientY);

    		if (!!target) {
    			target = target.closest('.item');

    			if (target && target != lastTarget) {
    				lastTarget = target;
    				dragEnter(ev, target);
    			}
    		}
    	}

    	function dragEnter(ev, target) {
    		// swap items in data
    		let targetElement = target;

    		if (grabbed && target != grabbed && targetElement.classList.contains('item')) {
    			moveDatum(parseInt(grabbed.dataset.index), parseInt(targetElement.dataset.index));
    		}
    	}

    	// does the actual moving of items in data
    	function moveDatum(from, to) {
    		let temp = data[from];
    		$$invalidate(0, data = [...data.slice(0, from), ...data.slice(from + 1)]);
    		$$invalidate(0, data = [...data.slice(0, to), temp, ...data.slice(to)]);
    	}

    	function release(ev) {
    		$$invalidate(3, grabbed = null);
    	}

    	function removeDatum(index) {
    		$$invalidate(0, data = [...data.slice(0, index), ...data.slice(index + 1)]);
    	}

    	const writable_props = ['data', 'removesItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DragDropList> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ghost = $$value;
    			$$invalidate(2, ghost);
    		});
    	}

    	const click_handler = function (i, ev) {
    		moveDatum(i, i - 1);
    	};

    	const click_handler_1 = function (i, ev) {
    		moveDatum(i, i + 1);
    	};

    	const click_handler_2 = function (i, ev) {
    		removeDatum(i);
    	};

    	const mousedown_handler = function (ev) {
    		grab(ev.clientY, this);
    	};

    	const touchstart_handler = function (ev) {
    		grab(ev.touches[0].clientY, this);
    	};

    	const mouseenter_handler = function (ev) {
    		ev.stopPropagation();
    		dragEnter(ev, ev.target);
    	};

    	const touchmove_handler = function (ev) {
    		ev.stopPropagation();
    		ev.preventDefault();
    		touchEnter(ev.touches[0]);
    	};

    	const mousemove_handler = function (ev) {
    		ev.stopPropagation();
    		drag(ev.clientY);
    	};

    	const touchmove_handler_1 = function (ev) {
    		ev.stopPropagation();
    		drag(ev.touches[0].clientY);
    	};

    	const mouseup_handler = function (ev) {
    		ev.stopPropagation();
    		release();
    	};

    	const mouseleave_handler = function (ev) {
    		ev.stopPropagation();
    		release();
    	};

    	const touchend_handler = function (ev) {
    		ev.stopPropagation();
    		release(ev.touches[0]);
    	};

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('removesItems' in $$props) $$invalidate(1, removesItems = $$props.removesItems);
    	};

    	$$self.$capture_state = () => ({
    		flip,
    		data,
    		removesItems,
    		ghost,
    		grabbed,
    		lastTarget,
    		mouseY,
    		offsetY,
    		layerY,
    		grab,
    		drag,
    		touchEnter,
    		dragEnter,
    		moveDatum,
    		release,
    		removeDatum
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('removesItems' in $$props) $$invalidate(1, removesItems = $$props.removesItems);
    		if ('ghost' in $$props) $$invalidate(2, ghost = $$props.ghost);
    		if ('grabbed' in $$props) $$invalidate(3, grabbed = $$props.grabbed);
    		if ('lastTarget' in $$props) lastTarget = $$props.lastTarget;
    		if ('mouseY' in $$props) $$invalidate(4, mouseY = $$props.mouseY);
    		if ('offsetY' in $$props) $$invalidate(5, offsetY = $$props.offsetY);
    		if ('layerY' in $$props) $$invalidate(6, layerY = $$props.layerY);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		data,
    		removesItems,
    		ghost,
    		grabbed,
    		mouseY,
    		offsetY,
    		layerY,
    		grab,
    		drag,
    		touchEnter,
    		dragEnter,
    		moveDatum,
    		release,
    		removeDatum,
    		div0_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		mousedown_handler,
    		touchstart_handler,
    		mouseenter_handler,
    		touchmove_handler,
    		mousemove_handler,
    		touchmove_handler_1,
    		mouseup_handler,
    		mouseleave_handler,
    		touchend_handler
    	];
    }

    class DragDropList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, { data: 0, removesItems: 1 }, add_css$8);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DragDropList",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get data() {
    		throw new Error("<DragDropList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<DragDropList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removesItems() {
    		throw new Error("<DragDropList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removesItems(value) {
    		throw new Error("<DragDropList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SequenceView.svelte generated by Svelte v3.44.1 */

    function create_fragment$c(ctx) {
    	let dragdroplist;
    	let updating_data;
    	let current;

    	function dragdroplist_data_binding(value) {
    		/*dragdroplist_data_binding*/ ctx[1](value);
    	}

    	let dragdroplist_props = {};

    	if (/*question*/ ctx[0].answers !== void 0) {
    		dragdroplist_props.data = /*question*/ ctx[0].answers;
    	}

    	dragdroplist = new DragDropList({
    			props: dragdroplist_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(dragdroplist, 'data', dragdroplist_data_binding));

    	const block = {
    		c: function create() {
    			create_component(dragdroplist.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dragdroplist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dragdroplist_changes = {};

    			if (!updating_data && dirty & /*question*/ 1) {
    				updating_data = true;
    				dragdroplist_changes.data = /*question*/ ctx[0].answers;
    				add_flush_callback(() => updating_data = false);
    			}

    			dragdroplist.$set(dragdroplist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dragdroplist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dragdroplist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dragdroplist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SequenceView', slots, []);
    	let { question } = $$props;
    	const writable_props = ['question'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SequenceView> was created with unknown prop '${key}'`);
    	});

    	function dragdroplist_data_binding(value) {
    		if ($$self.$$.not_equal(question.answers, value)) {
    			question.answers = value;
    			$$invalidate(0, question);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('question' in $$props) $$invalidate(0, question = $$props.question);
    	};

    	$$self.$capture_state = () => ({ DragDropList, question });

    	$$self.$inject_state = $$props => {
    		if ('question' in $$props) $$invalidate(0, question = $$props.question);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*question*/ 1) {
    			{
    				$$invalidate(0, question.selected = question.answers.map(answer => answer.id), question);
    			}
    		}
    	};

    	return [question, dragdroplist_data_binding];
    }

    class SequenceView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, { question: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SequenceView",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*question*/ ctx[0] === undefined && !('question' in props)) {
    			console.warn("<SequenceView> was created without expected prop 'question'");
    		}
    	}

    	get question() {
    		throw new Error("<SequenceView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set question(value) {
    		throw new Error("<SequenceView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ChoiceView.svelte generated by Svelte v3.44.1 */

    const file$a = "src/components/ChoiceView.svelte";

    function add_css$7(target) {
    	append_styles(target, "svelte-1sd30pc", "fieldset.svelte-1sd30pc.svelte-1sd30pc{border:0}[type='checkbox'].svelte-1sd30pc.svelte-1sd30pc,[type='radio'].svelte-1sd30pc.svelte-1sd30pc{position:absolute;opacity:0}[type='radio'].svelte-1sd30pc+span.svelte-1sd30pc{border-radius:0.5em}[type='checkbox'].svelte-1sd30pc+span.svelte-1sd30pc{border-radius:2px}[type='checkbox'].svelte-1sd30pc+span.svelte-1sd30pc,[type='radio'].svelte-1sd30pc+span.svelte-1sd30pc{transition-duration:0.3s;background-color:var(--quizdown-color-secondary);color:var(--quizdown-color-text);display:block;padding:0.5rem;margin:5px;border:3px solid transparent;cursor:pointer}[type='checkbox'].svelte-1sd30pc:hover+span.svelte-1sd30pc,[type='checkbox'].svelte-1sd30pc:focus+span.svelte-1sd30pc,[type='radio'].svelte-1sd30pc:hover+span.svelte-1sd30pc,[type='radio'].svelte-1sd30pc:focus+span.svelte-1sd30pc{filter:brightness(0.9)}[type='checkbox'].svelte-1sd30pc:checked+span.svelte-1sd30pc,[type='radio'].svelte-1sd30pc:checked+span.svelte-1sd30pc{border:3px solid var(--quizdown-color-primary)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hvaWNlVmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBQ0ksUUFBQSw4QkFBQSxDQUFBLEFBQ0ksTUFBQSxDQUFBLENBQVMsQUFDYixDQUFBLEFBRUEsQ0FBQSxJQUFBLENBQUEsVUFBQSwrQkFBQSw4Q0FFSSxRQUFBLENBQUEsUUFBa0IsQ0FDbEIsT0FBQSxDQUFBLENBQVUsQUFDZCxDQUFBLEFBRUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxnQkFBQSxDQUFBLElBQUEsZUFBQSxDQUFBLEFBQ0ksYUFBQSxDQUFBLEtBQW9CLEFBQ3hCLENBQUEsQUFFQSxDQUFBLElBQUEsQ0FBQSxVQUFBLGdCQUFBLENBQUEsSUFBQSxlQUFBLENBQUEsQUFDSSxhQUFBLENBQUEsR0FBa0IsQUFDdEIsQ0FBQSxBQUVBLENBQUEsSUFBQSxDQUFBLFVBQUEsZ0JBQUEsQ0FBQSxtQkFBQSxtREFFSSxtQkFBQSxDQUFBLElBQXlCLENBQ3pCLGdCQUFBLENBQUEsSUFBQSwwQkFBQSxDQUFpRCxDQUNqRCxLQUFBLENBQUEsSUFBQSxxQkFBQSxDQUFpQyxDQUNqQyxPQUFBLENBQUEsS0FBYyxDQUNkLE9BQUEsQ0FBQSxNQUFlLENBQ2YsTUFBQSxDQUFBLEdBQVcsQ0FDWCxNQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxXQUE2QixDQUM3QixNQUFBLENBQUEsT0FBZSxBQUNuQixDQUFBLEFBRUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxnQkFBQSxNQUFBLENBQUEsbUJBQUEsNEtBSUksTUFBQSxDQUFBLFdBQUEsR0FBQSxDQUF1QixBQUMzQixDQUFBLEFBRUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxnQkFBQSxRQUFBLENBQUEsbUJBQUEsMkRBRUksTUFBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsSUFBQSx3QkFBQSxDQUErQyxBQUNuRCxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL0Nob2ljZVZpZXcuc3ZlbHRlIl19 */");
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (17:4) {:else}
    function create_else_block$2(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*question*/ ctx[0].answers;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*question*/ 1) {
    				each_value_1 = /*question*/ ctx[0].answers;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(17:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:4) {#if question.questionType === 'MultipleChoice'}
    function create_if_block$5(ctx) {
    	let each_1_anchor;
    	let each_value = /*question*/ ctx[0].answers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*question*/ 1) {
    				each_value = /*question*/ ctx[0].answers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(6:4) {#if question.questionType === 'MultipleChoice'}",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#each question.answers as answer, i}
    function create_each_block_1$1(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let raw_value = /*answer*/ ctx[4].html + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			attr_dev(input, "type", "radio");
    			input.__value = /*i*/ ctx[6];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-1sd30pc");
    			/*$$binding_groups*/ ctx[2][1].push(input);
    			add_location(input, file$a, 19, 16, 525);
    			attr_dev(span, "class", "svelte-1sd30pc");
    			add_location(span, file$a, 24, 16, 688);
    			add_location(label, file$a, 18, 12, 501);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*question*/ ctx[0].selected[0];
    			append_dev(label, t0);
    			append_dev(label, span);
    			span.innerHTML = raw_value;
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*question*/ 1) {
    				input.checked = input.__value === /*question*/ ctx[0].selected[0];
    			}

    			if (dirty & /*question*/ 1 && raw_value !== (raw_value = /*answer*/ ctx[4].html + "")) span.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[2][1].splice(/*$$binding_groups*/ ctx[2][1].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(18:8) {#each question.answers as answer, i}",
    		ctx
    	});

    	return block;
    }

    // (7:8) {#each question.answers as answer, i}
    function create_each_block$2(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let raw_value = /*answer*/ ctx[4].html + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			attr_dev(input, "type", "checkbox");
    			input.__value = /*i*/ ctx[6];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-1sd30pc");
    			/*$$binding_groups*/ ctx[2][0].push(input);
    			add_location(input, file$a, 8, 16, 198);
    			attr_dev(span, "class", "svelte-1sd30pc");
    			add_location(span, file$a, 13, 16, 361);
    			add_location(label, file$a, 7, 12, 174);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = ~/*question*/ ctx[0].selected.indexOf(input.__value);
    			append_dev(label, t0);
    			append_dev(label, span);
    			span.innerHTML = raw_value;
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*question*/ 1) {
    				input.checked = ~/*question*/ ctx[0].selected.indexOf(input.__value);
    			}

    			if (dirty & /*question*/ 1 && raw_value !== (raw_value = /*answer*/ ctx[4].html + "")) span.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[2][0].splice(/*$$binding_groups*/ ctx[2][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(7:8) {#each question.answers as answer, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let fieldset;

    	function select_block_type(ctx, dirty) {
    		if (/*question*/ ctx[0].questionType === 'MultipleChoice') return create_if_block$5;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			if_block.c();
    			attr_dev(fieldset, "class", "svelte-1sd30pc");
    			add_location(fieldset, file$a, 4, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			if_block.m(fieldset, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(fieldset, null);
    				}
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChoiceView', slots, []);
    	let { question } = $$props;
    	const writable_props = ['question'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChoiceView> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], []];

    	function input_change_handler() {
    		question.selected = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(0, question);
    	}

    	function input_change_handler_1() {
    		question.selected[0] = this.__value;
    		$$invalidate(0, question);
    	}

    	$$self.$$set = $$props => {
    		if ('question' in $$props) $$invalidate(0, question = $$props.question);
    	};

    	$$self.$capture_state = () => ({ question });

    	$$self.$inject_state = $$props => {
    		if ('question' in $$props) $$invalidate(0, question = $$props.question);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [question, input_change_handler, $$binding_groups, input_change_handler_1];
    }

    class ChoiceView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, { question: 0 }, add_css$7);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChoiceView",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*question*/ ctx[0] === undefined && !('question' in props)) {
    			console.warn("<ChoiceView> was created without expected prop 'question'");
    		}
    	}

    	get question() {
    		throw new Error("<ChoiceView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set question(value) {
    		throw new Error("<ChoiceView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/QuestionView.svelte generated by Svelte v3.44.1 */
    const file$9 = "src/components/QuestionView.svelte";

    // (20:0) {#if question.explanation}
    function create_if_block$4(ctx) {
    	let p;
    	let raw_value = /*question*/ ctx[0].explanation + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			add_location(p, file$9, 20, 4, 436);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*question*/ 1 && raw_value !== (raw_value = /*question*/ ctx[0].explanation + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(20:0) {#if question.explanation}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let h3;
    	let t0;
    	let t1;
    	let t2;
    	let html_tag;
    	let raw_value = /*question*/ ctx[0].text + "";
    	let t3;
    	let t4;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	let if_block = /*question*/ ctx[0].explanation && create_if_block$4(ctx);
    	var switch_value = /*componentMap*/ ctx[2][/*question*/ ctx[0].questionType];

    	function switch_props(ctx) {
    		return {
    			props: { question: /*question*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text$1("Q");
    			t1 = text$1(/*n*/ ctx[1]);
    			t2 = text$1(": ");
    			html_tag = new HtmlTag();
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			html_tag.a = null;
    			add_location(h3, file$9, 15, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    			html_tag.m(raw_value, h3);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t4, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*n*/ 2) set_data_dev(t1, /*n*/ ctx[1]);
    			if ((!current || dirty & /*question*/ 1) && raw_value !== (raw_value = /*question*/ ctx[0].text + "")) html_tag.p(raw_value);

    			if (/*question*/ ctx[0].explanation) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(t4.parentNode, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const switch_instance_changes = {};
    			if (dirty & /*question*/ 1) switch_instance_changes.question = /*question*/ ctx[0];

    			if (switch_value !== (switch_value = /*componentMap*/ ctx[2][/*question*/ ctx[0].questionType])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QuestionView', slots, []);
    	let { question } = $$props;
    	let { n } = $$props;

    	// a mapping from quiz types to svelte components
    	let componentMap = {
    		Sequence: SequenceView,
    		MultipleChoice: ChoiceView,
    		SingleChoice: ChoiceView
    	};

    	const writable_props = ['question', 'n'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QuestionView> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('question' in $$props) $$invalidate(0, question = $$props.question);
    		if ('n' in $$props) $$invalidate(1, n = $$props.n);
    	};

    	$$self.$capture_state = () => ({
    		SequenceView,
    		ChoiceView,
    		_: X,
    		question,
    		n,
    		componentMap
    	});

    	$$self.$inject_state = $$props => {
    		if ('question' in $$props) $$invalidate(0, question = $$props.question);
    		if ('n' in $$props) $$invalidate(1, n = $$props.n);
    		if ('componentMap' in $$props) $$invalidate(2, componentMap = $$props.componentMap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [question, n, componentMap];
    }

    class QuestionView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, { question: 0, n: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuestionView",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*question*/ ctx[0] === undefined && !('question' in props)) {
    			console.warn("<QuestionView> was created without expected prop 'question'");
    		}

    		if (/*n*/ ctx[1] === undefined && !('n' in props)) {
    			console.warn("<QuestionView> was created without expected prop 'n'");
    		}
    	}

    	get question() {
    		throw new Error("<QuestionView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set question(value) {
    		throw new Error("<QuestionView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get n() {
    		throw new Error("<QuestionView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set n(value) {
    		throw new Error("<QuestionView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Row.svelte generated by Svelte v3.44.1 */

    const file$8 = "src/components/Row.svelte";

    function add_css$6(target) {
    	append_styles(target, "svelte-g2byos", ".row.svelte-g2byos{padding-top:2em;display:flex}.left.svelte-g2byos{flex:1;display:flex;justify-content:flex-start}.center.svelte-g2byos{display:flex;justify-content:center}.right.svelte-g2byos{flex:1;display:flex;justify-content:flex-end}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93LnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFDSSxJQUFBLGNBQUEsQ0FBQSxBQUNJLFdBQUEsQ0FBQSxHQUFnQixDQUNoQixPQUFBLENBQUEsSUFBYSxBQUNqQixDQUFBLEFBRUEsS0FBQSxjQUFBLENBQUEsQUFDSSxJQUFBLENBQUEsQ0FBTyxDQUNQLE9BQUEsQ0FBQSxJQUFhLENBQ2IsZUFBQSxDQUFBLFVBQTJCLEFBQy9CLENBQUEsQUFFQSxPQUFBLGNBQUEsQ0FBQSxBQUNJLE9BQUEsQ0FBQSxJQUFhLENBQ2IsZUFBQSxDQUFBLE1BQXVCLEFBQzNCLENBQUEsQUFFQSxNQUFBLGNBQUEsQ0FBQSxBQUNJLElBQUEsQ0FBQSxDQUFPLENBQ1AsT0FBQSxDQUFBLElBQWEsQ0FDYixlQUFBLENBQUEsUUFBeUIsQUFDN0IsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJzcmMvY29tcG9uZW50cy9Sb3cuc3ZlbHRlIl19 */");
    }

    const get_right_slot_changes = dirty => ({});
    const get_right_slot_context = ctx => ({});
    const get_center_slot_changes = dirty => ({});
    const get_center_slot_context = ctx => ({ class: "center svelte-g2byos" });
    const get_left_slot_changes = dirty => ({});
    const get_left_slot_context = ctx => ({});

    function create_fragment$9(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let current;
    	const left_slot_template = /*#slots*/ ctx[1].left;
    	const left_slot = create_slot(left_slot_template, ctx, /*$$scope*/ ctx[0], get_left_slot_context);
    	const center_slot_template = /*#slots*/ ctx[1].center;
    	const center_slot = create_slot(center_slot_template, ctx, /*$$scope*/ ctx[0], get_center_slot_context);
    	const right_slot_template = /*#slots*/ ctx[1].right;
    	const right_slot = create_slot(right_slot_template, ctx, /*$$scope*/ ctx[0], get_right_slot_context);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if (left_slot) left_slot.c();
    			t0 = space();
    			div1 = element("div");
    			if (center_slot) center_slot.c();
    			t1 = space();
    			div2 = element("div");
    			if (right_slot) right_slot.c();
    			attr_dev(div0, "class", "left svelte-g2byos");
    			add_location(div0, file$8, 1, 4, 22);
    			attr_dev(div1, "class", "center svelte-g2byos");
    			add_location(div1, file$8, 4, 4, 85);
    			attr_dev(div2, "class", "right svelte-g2byos");
    			add_location(div2, file$8, 7, 4, 167);
    			attr_dev(div3, "class", "row svelte-g2byos");
    			add_location(div3, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			if (left_slot) {
    				left_slot.m(div0, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div1);

    			if (center_slot) {
    				center_slot.m(div1, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			if (right_slot) {
    				right_slot.m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (left_slot) {
    				if (left_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						left_slot,
    						left_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(left_slot_template, /*$$scope*/ ctx[0], dirty, get_left_slot_changes),
    						get_left_slot_context
    					);
    				}
    			}

    			if (center_slot) {
    				if (center_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						center_slot,
    						center_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(center_slot_template, /*$$scope*/ ctx[0], dirty, get_center_slot_changes),
    						get_center_slot_context
    					);
    				}
    			}

    			if (right_slot) {
    				if (right_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						right_slot,
    						right_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(right_slot_template, /*$$scope*/ ctx[0], dirty, get_right_slot_changes),
    						get_right_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(left_slot, local);
    			transition_in(center_slot, local);
    			transition_in(right_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(left_slot, local);
    			transition_out(center_slot, local);
    			transition_out(right_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (left_slot) left_slot.d(detaching);
    			if (center_slot) center_slot.d(detaching);
    			if (right_slot) right_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['left','center','right']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, {}, add_css$6);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.44.1 */

    const file$7 = "src/components/Button.svelte";

    function add_css$5(target) {
    	append_styles(target, "svelte-1jsrwnn", "button.svelte-1jsrwnn:disabled{background-color:white;filter:grayscale(100%);color:gray;cursor:initial;opacity:50%}button.svelte-1jsrwnn{background-color:white;color:var(--quizdown-color-text);padding:0.5rem 1rem;border-radius:4px;border:1px solid transparent;line-height:1;text-align:center;transition:opacity 0.2s ease;text-decoration:none;display:inline-block;cursor:pointer;margin:0.2rem;font-size:1em}button.svelte-1jsrwnn:hover:not(:checked):not(:active):not(:disabled){filter:brightness(0.9)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFDSSxxQkFBQSxTQUFBLEFBQUEsQ0FBQSxBQUNJLGdCQUFBLENBQUEsS0FBdUIsQ0FDdkIsTUFBQSxDQUFBLFVBQUEsSUFBQSxDQUF1QixDQUN2QixLQUFBLENBQUEsSUFBVyxDQUNYLE1BQUEsQ0FBQSxPQUFlLENBQ2YsT0FBQSxDQUFBLEdBQVksQUFDaEIsQ0FBQSxBQUVBLE1BQUEsZUFBQSxDQUFBLEFBQ0ksZ0JBQUEsQ0FBQSxLQUF1QixDQUN2QixLQUFBLENBQUEsSUFBQSxxQkFBQSxDQUFpQyxDQUNqQyxPQUFBLENBQUEsTUFBQSxDQUFBLElBQW9CLENBQ3BCLGFBQUEsQ0FBQSxHQUFrQixDQUNsQixNQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxXQUE2QixDQUM3QixXQUFBLENBQUEsQ0FBYyxDQUNkLFVBQUEsQ0FBQSxNQUFrQixDQUNsQixVQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxJQUE2QixDQUM3QixlQUFBLENBQUEsSUFBcUIsQ0FDckIsT0FBQSxDQUFBLFlBQXFCLENBQ3JCLE1BQUEsQ0FBQSxPQUFlLENBQ2YsTUFBQSxDQUFBLE1BQWMsQ0FDZCxTQUFBLENBQUEsR0FBYyxBQUNsQixDQUFBLEFBRUEscUJBQUEsTUFBQSxLQUFBLFFBQUEsQ0FBQSxLQUFBLE9BQUEsQ0FBQSxLQUFBLFNBQUEsQ0FBQSxBQUFBLENBQUEsQUFDSSxNQUFBLENBQUEsV0FBQSxHQUFBLENBQXVCLEFBQzNCLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvQnV0dG9uLnN2ZWx0ZSJdfQ== */");
    }

    function create_fragment$8(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "data-testid", "testButton");
    			attr_dev(button, "title", /*title*/ ctx[2]);
    			button.disabled = /*disabled*/ ctx[1];
    			attr_dev(button, "class", "svelte-1jsrwnn");
    			add_location(button, file$7, 5, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*buttonAction*/ ctx[0])) /*buttonAction*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*title*/ 4) {
    				attr_dev(button, "title", /*title*/ ctx[2]);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { buttonAction = () => alert('Life has never Svelte better') } = $$props;
    	let { disabled = false } = $$props;
    	let { title = '' } = $$props;
    	const writable_props = ['buttonAction', 'disabled', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('buttonAction' in $$props) $$invalidate(0, buttonAction = $$props.buttonAction);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ buttonAction, disabled, title });

    	$$self.$inject_state = $$props => {
    		if ('buttonAction' in $$props) $$invalidate(0, buttonAction = $$props.buttonAction);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buttonAction, disabled, title, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, { buttonAction: 0, disabled: 1, title: 2 }, add_css$5);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get buttonAction() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonAction(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /*!
     * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);

        if (typeof Object.getOwnPropertySymbols === 'function') {
          ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          }));
        }

        ownKeys.forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      }

      return target;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }

    var noop = function noop() {};

    var _WINDOW = {};
    var _DOCUMENT = {};
    var _MUTATION_OBSERVER = null;
    var _PERFORMANCE = {
      mark: noop,
      measure: noop
    };

    try {
      if (typeof window !== 'undefined') _WINDOW = window;
      if (typeof document !== 'undefined') _DOCUMENT = document;
      if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER = MutationObserver;
      if (typeof performance !== 'undefined') _PERFORMANCE = performance;
    } catch (e) {}

    var _ref$1 = _WINDOW.navigator || {},
        _ref$userAgent = _ref$1.userAgent,
        userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;

    var WINDOW = _WINDOW;
    var DOCUMENT$1 = _DOCUMENT;
    var PERFORMANCE = _PERFORMANCE;
    !!WINDOW.document;
    var IS_DOM = !!DOCUMENT$1.documentElement && !!DOCUMENT$1.head && typeof DOCUMENT$1.addEventListener === 'function' && typeof DOCUMENT$1.createElement === 'function';
    ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

    var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
    var DEFAULT_FAMILY_PREFIX = 'fa';
    var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
    var DATA_FA_I2SVG = 'data-fa-i2svg';
    (function () {
      try {
        return process.env.NODE_ENV === 'production';
      } catch (e) {
        return false;
      }
    })();
    var DUOTONE_CLASSES = {
      GROUP: 'group',
      SWAP_OPACITY: 'swap-opacity',
      PRIMARY: 'primary',
      SECONDARY: 'secondary'
    };

    var initial = WINDOW.FontAwesomeConfig || {};

    function getAttrConfig(attr) {
      var element = DOCUMENT$1.querySelector('script[' + attr + ']');

      if (element) {
        return element.getAttribute(attr);
      }
    }

    function coerce(val) {
      // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
      // We'll assume that this is an indication that it should be toggled to true
      // For example <script data-search-pseudo-elements src="..."></script>
      if (val === '') return true;
      if (val === 'false') return false;
      if (val === 'true') return true;
      return val;
    }

    if (DOCUMENT$1 && typeof DOCUMENT$1.querySelector === 'function') {
      var attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];
      attrs.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            attr = _ref2[0],
            key = _ref2[1];

        var val = coerce(getAttrConfig(attr));

        if (val !== undefined && val !== null) {
          initial[key] = val;
        }
      });
    }

    var _default = {
      familyPrefix: DEFAULT_FAMILY_PREFIX,
      replacementClass: DEFAULT_REPLACEMENT_CLASS,
      autoReplaceSvg: true,
      autoAddCss: true,
      autoA11y: true,
      searchPseudoElements: false,
      observeMutations: true,
      mutateApproach: 'async',
      keepOriginalSource: true,
      measurePerformance: false,
      showMissingIcons: true
    };

    var _config = _objectSpread({}, _default, initial);

    if (!_config.autoReplaceSvg) _config.observeMutations = false;

    var config = _objectSpread({}, _config);

    WINDOW.FontAwesomeConfig = config;

    var w = WINDOW || {};
    if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
    if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
    if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
    if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
    var namespace = w[NAMESPACE_IDENTIFIER];

    var functions = [];

    var listener = function listener() {
      DOCUMENT$1.removeEventListener('DOMContentLoaded', listener);
      loaded = 1;
      functions.map(function (fn) {
        return fn();
      });
    };

    var loaded = false;

    if (IS_DOM) {
      loaded = (DOCUMENT$1.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT$1.readyState);
      if (!loaded) DOCUMENT$1.addEventListener('DOMContentLoaded', listener);
    }

    typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function';
    typeof setImmediate === 'undefined' ? setTimeout : setImmediate;
    var meaninglessTransform = {
      size: 16,
      x: 0,
      y: 0,
      rotate: 0,
      flipX: false,
      flipY: false
    };
    function insertCss(css) {
      if (!css || !IS_DOM) {
        return;
      }

      var style = DOCUMENT$1.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = css;
      var headChildren = DOCUMENT$1.head.childNodes;
      var beforeChild = null;

      for (var i = headChildren.length - 1; i > -1; i--) {
        var child = headChildren[i];
        var tagName = (child.tagName || '').toUpperCase();

        if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
          beforeChild = child;
        }
      }

      DOCUMENT$1.head.insertBefore(style, beforeChild);
      return css;
    }
    var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    function nextUniqueId() {
      var size = 12;
      var id = '';

      while (size-- > 0) {
        id += idPool[Math.random() * 62 | 0];
      }

      return id;
    }
    function htmlEscape(str) {
      return "".concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function joinAttributes(attributes) {
      return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
        return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
      }, '').trim();
    }
    function joinStyles(styles) {
      return Object.keys(styles || {}).reduce(function (acc, styleName) {
        return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
      }, '');
    }
    function transformIsMeaningful(transform) {
      return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
    }
    function transformForSvg(_ref) {
      var transform = _ref.transform,
          containerWidth = _ref.containerWidth,
          iconWidth = _ref.iconWidth;
      var outer = {
        transform: "translate(".concat(containerWidth / 2, " 256)")
      };
      var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
      var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
      var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
      var inner = {
        transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
      };
      var path = {
        transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
      };
      return {
        outer: outer,
        inner: inner,
        path: path
      };
    }

    var ALL_SPACE = {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%'
    };

    function fillBlack(abstract) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (abstract.attributes && (abstract.attributes.fill || force)) {
        abstract.attributes.fill = 'black';
      }

      return abstract;
    }

    function deGroup(abstract) {
      if (abstract.tag === 'g') {
        return abstract.children;
      } else {
        return [abstract];
      }
    }

    function makeIconMasking (_ref) {
      var children = _ref.children,
          attributes = _ref.attributes,
          main = _ref.main,
          mask = _ref.mask,
          explicitMaskId = _ref.maskId,
          transform = _ref.transform;
      var mainWidth = main.width,
          mainPath = main.icon;
      var maskWidth = mask.width,
          maskPath = mask.icon;
      var trans = transformForSvg({
        transform: transform,
        containerWidth: maskWidth,
        iconWidth: mainWidth
      });
      var maskRect = {
        tag: 'rect',
        attributes: _objectSpread({}, ALL_SPACE, {
          fill: 'white'
        })
      };
      var maskInnerGroupChildrenMixin = mainPath.children ? {
        children: mainPath.children.map(fillBlack)
      } : {};
      var maskInnerGroup = {
        tag: 'g',
        attributes: _objectSpread({}, trans.inner),
        children: [fillBlack(_objectSpread({
          tag: mainPath.tag,
          attributes: _objectSpread({}, mainPath.attributes, trans.path)
        }, maskInnerGroupChildrenMixin))]
      };
      var maskOuterGroup = {
        tag: 'g',
        attributes: _objectSpread({}, trans.outer),
        children: [maskInnerGroup]
      };
      var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
      var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
      var maskTag = {
        tag: 'mask',
        attributes: _objectSpread({}, ALL_SPACE, {
          id: maskId,
          maskUnits: 'userSpaceOnUse',
          maskContentUnits: 'userSpaceOnUse'
        }),
        children: [maskRect, maskOuterGroup]
      };
      var defs = {
        tag: 'defs',
        children: [{
          tag: 'clipPath',
          attributes: {
            id: clipId
          },
          children: deGroup(maskPath)
        }, maskTag]
      };
      children.push(defs, {
        tag: 'rect',
        attributes: _objectSpread({
          fill: 'currentColor',
          'clip-path': "url(#".concat(clipId, ")"),
          mask: "url(#".concat(maskId, ")")
        }, ALL_SPACE)
      });
      return {
        children: children,
        attributes: attributes
      };
    }

    function makeIconStandard (_ref) {
      var children = _ref.children,
          attributes = _ref.attributes,
          main = _ref.main,
          transform = _ref.transform,
          styles = _ref.styles;
      var styleString = joinStyles(styles);

      if (styleString.length > 0) {
        attributes['style'] = styleString;
      }

      if (transformIsMeaningful(transform)) {
        var trans = transformForSvg({
          transform: transform,
          containerWidth: main.width,
          iconWidth: main.width
        });
        children.push({
          tag: 'g',
          attributes: _objectSpread({}, trans.outer),
          children: [{
            tag: 'g',
            attributes: _objectSpread({}, trans.inner),
            children: [{
              tag: main.icon.tag,
              children: main.icon.children,
              attributes: _objectSpread({}, main.icon.attributes, trans.path)
            }]
          }]
        });
      } else {
        children.push(main.icon);
      }

      return {
        children: children,
        attributes: attributes
      };
    }

    function asIcon (_ref) {
      var children = _ref.children,
          main = _ref.main,
          mask = _ref.mask,
          attributes = _ref.attributes,
          styles = _ref.styles,
          transform = _ref.transform;

      if (transformIsMeaningful(transform) && main.found && !mask.found) {
        var width = main.width,
            height = main.height;
        var offset = {
          x: width / height / 2,
          y: 0.5
        };
        attributes['style'] = joinStyles(_objectSpread({}, styles, {
          'transform-origin': "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
        }));
      }

      return [{
        tag: 'svg',
        attributes: attributes,
        children: children
      }];
    }

    function asSymbol (_ref) {
      var prefix = _ref.prefix,
          iconName = _ref.iconName,
          children = _ref.children,
          attributes = _ref.attributes,
          symbol = _ref.symbol;
      var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
      return [{
        tag: 'svg',
        attributes: {
          style: 'display: none;'
        },
        children: [{
          tag: 'symbol',
          attributes: _objectSpread({}, attributes, {
            id: id
          }),
          children: children
        }]
      }];
    }

    function makeInlineSvgAbstract(params) {
      var _params$icons = params.icons,
          main = _params$icons.main,
          mask = _params$icons.mask,
          prefix = params.prefix,
          iconName = params.iconName,
          transform = params.transform,
          symbol = params.symbol,
          title = params.title,
          maskId = params.maskId,
          titleId = params.titleId,
          extra = params.extra,
          _params$watchable = params.watchable,
          watchable = _params$watchable === void 0 ? false : _params$watchable;

      var _ref = mask.found ? mask : main,
          width = _ref.width,
          height = _ref.height;

      var isUploadedIcon = prefix === 'fak';
      var widthClass = isUploadedIcon ? '' : "fa-w-".concat(Math.ceil(width / height * 16));
      var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : '', widthClass].filter(function (c) {
        return extra.classes.indexOf(c) === -1;
      }).filter(function (c) {
        return c !== '' || !!c;
      }).concat(extra.classes).join(' ');
      var content = {
        children: [],
        attributes: _objectSpread({}, extra.attributes, {
          'data-prefix': prefix,
          'data-icon': iconName,
          'class': attrClass,
          'role': extra.attributes.role || 'img',
          'xmlns': 'http://www.w3.org/2000/svg',
          'viewBox': "0 0 ".concat(width, " ").concat(height)
        })
      };
      var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf('fa-fw') ? {
        width: "".concat(width / height * 16 * 0.0625, "em")
      } : {};

      if (watchable) {
        content.attributes[DATA_FA_I2SVG] = '';
      }

      if (title) content.children.push({
        tag: 'title',
        attributes: {
          id: content.attributes['aria-labelledby'] || "title-".concat(titleId || nextUniqueId())
        },
        children: [title]
      });

      var args = _objectSpread({}, content, {
        prefix: prefix,
        iconName: iconName,
        main: main,
        mask: mask,
        maskId: maskId,
        transform: transform,
        symbol: symbol,
        styles: _objectSpread({}, uploadedIconWidthStyle, extra.styles)
      });

      var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
          children = _ref2.children,
          attributes = _ref2.attributes;

      args.children = children;
      args.attributes = attributes;

      if (symbol) {
        return asSymbol(args);
      } else {
        return asIcon(args);
      }
    }

    var noop$1 = function noop() {};

    config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
      mark: noop$1,
      measure: noop$1
    };

    /**
     * Internal helper to bind a function known to have 4 arguments
     * to a given context.
     */

    var bindInternal4 = function bindInternal4(func, thisContext) {
      return function (a, b, c, d) {
        return func.call(thisContext, a, b, c, d);
      };
    };

    /**
     * # Reduce
     *
     * A fast object `.reduce()` implementation.
     *
     * @param  {Object}   subject      The object to reduce over.
     * @param  {Function} fn           The reducer function.
     * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
     * @param  {Object}   thisContext  The context for the reducer.
     * @return {mixed}                 The final result.
     */


    var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
      var keys = Object.keys(subject),
          length = keys.length,
          iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
          i,
          key,
          result;

      if (initialValue === undefined) {
        i = 1;
        result = subject[keys[0]];
      } else {
        i = 0;
        result = initialValue;
      }

      for (; i < length; i++) {
        key = keys[i];
        result = iterator(result, subject[key], key, subject);
      }

      return result;
    };

    function defineIcons(prefix, icons) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _params$skipHooks = params.skipHooks,
          skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
      var normalized = Object.keys(icons).reduce(function (acc, iconName) {
        var icon = icons[iconName];
        var expanded = !!icon.icon;

        if (expanded) {
          acc[icon.iconName] = icon.icon;
        } else {
          acc[iconName] = icon;
        }

        return acc;
      }, {});

      if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
        namespace.hooks.addPack(prefix, normalized);
      } else {
        namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized);
      }
      /**
       * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
       * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
       * for `fas` so we'll easy the upgrade process for our users by automatically defining
       * this as well.
       */


      if (prefix === 'fas') {
        defineIcons('fa', icons);
      }
    }

    var styles = namespace.styles,
        shims = namespace.shims;
    var build = function build() {
      var lookup = function lookup(reducer) {
        return reduce(styles, function (o, style, prefix) {
          o[prefix] = reduce(style, reducer, {});
          return o;
        }, {});
      };

      lookup(function (acc, icon, iconName) {
        if (icon[3]) {
          acc[icon[3]] = iconName;
        }

        return acc;
      });
      lookup(function (acc, icon, iconName) {
        var ligatures = icon[2];
        acc[iconName] = iconName;
        ligatures.forEach(function (ligature) {
          acc[ligature] = iconName;
        });
        return acc;
      });
      var hasRegular = 'far' in styles;
      reduce(shims, function (acc, shim) {
        var oldName = shim[0];
        var prefix = shim[1];
        var iconName = shim[2];

        if (prefix === 'far' && !hasRegular) {
          prefix = 'fas';
        }

        acc[oldName] = {
          prefix: prefix,
          iconName: iconName
        };
        return acc;
      }, {});
    };
    build();

    namespace.styles;
    function iconFromMapping(mapping, prefix, iconName) {
      if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
        return {
          prefix: prefix,
          iconName: iconName,
          icon: mapping[prefix][iconName]
        };
      }
    }

    function toHtml(abstractNodes) {
      var tag = abstractNodes.tag,
          _abstractNodes$attrib = abstractNodes.attributes,
          attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib,
          _abstractNodes$childr = abstractNodes.children,
          children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;

      if (typeof abstractNodes === 'string') {
        return htmlEscape(abstractNodes);
      } else {
        return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(''), "</").concat(tag, ">");
      }
    }

    var parseTransformString = function parseTransformString(transformString) {
      var transform = {
        size: 16,
        x: 0,
        y: 0,
        flipX: false,
        flipY: false,
        rotate: 0
      };

      if (!transformString) {
        return transform;
      } else {
        return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
          var parts = n.toLowerCase().split('-');
          var first = parts[0];
          var rest = parts.slice(1).join('-');

          if (first && rest === 'h') {
            acc.flipX = true;
            return acc;
          }

          if (first && rest === 'v') {
            acc.flipY = true;
            return acc;
          }

          rest = parseFloat(rest);

          if (isNaN(rest)) {
            return acc;
          }

          switch (first) {
            case 'grow':
              acc.size = acc.size + rest;
              break;

            case 'shrink':
              acc.size = acc.size - rest;
              break;

            case 'left':
              acc.x = acc.x - rest;
              break;

            case 'right':
              acc.x = acc.x + rest;
              break;

            case 'up':
              acc.y = acc.y - rest;
              break;

            case 'down':
              acc.y = acc.y + rest;
              break;

            case 'rotate':
              acc.rotate = acc.rotate + rest;
              break;
          }

          return acc;
        }, transform);
      }
    };

    function MissingIcon(error) {
      this.name = 'MissingIcon';
      this.message = error || 'Icon unavailable';
      this.stack = new Error().stack;
    }
    MissingIcon.prototype = Object.create(Error.prototype);
    MissingIcon.prototype.constructor = MissingIcon;

    var FILL = {
      fill: 'currentColor'
    };
    var ANIMATION_BASE = {
      attributeType: 'XML',
      repeatCount: 'indefinite',
      dur: '2s'
    };
    ({
      tag: 'path',
      attributes: _objectSpread({}, FILL, {
        d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
      })
    });

    var OPACITY_ANIMATE = _objectSpread({}, ANIMATION_BASE, {
      attributeName: 'opacity'
    });

    ({
      tag: 'circle',
      attributes: _objectSpread({}, FILL, {
        cx: '256',
        cy: '364',
        r: '28'
      }),
      children: [{
        tag: 'animate',
        attributes: _objectSpread({}, ANIMATION_BASE, {
          attributeName: 'r',
          values: '28;14;28;28;14;28;'
        })
      }, {
        tag: 'animate',
        attributes: _objectSpread({}, OPACITY_ANIMATE, {
          values: '1;0;1;1;0;1;'
        })
      }]
    });
    ({
      tag: 'path',
      attributes: _objectSpread({}, FILL, {
        opacity: '1',
        d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
      }),
      children: [{
        tag: 'animate',
        attributes: _objectSpread({}, OPACITY_ANIMATE, {
          values: '1;0;0;0;0;1;'
        })
      }]
    });
    ({
      tag: 'path',
      attributes: _objectSpread({}, FILL, {
        opacity: '0',
        d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
      }),
      children: [{
        tag: 'animate',
        attributes: _objectSpread({}, OPACITY_ANIMATE, {
          values: '0;0;1;1;0;0;'
        })
      }]
    });

    namespace.styles;
    function asFoundIcon(icon) {
      var width = icon[0];
      var height = icon[1];

      var _icon$slice = icon.slice(4),
          _icon$slice2 = _slicedToArray(_icon$slice, 1),
          vectorData = _icon$slice2[0];

      var element = null;

      if (Array.isArray(vectorData)) {
        element = {
          tag: 'g',
          attributes: {
            class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
          },
          children: [{
            tag: 'path',
            attributes: {
              class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
              fill: 'currentColor',
              d: vectorData[0]
            }
          }, {
            tag: 'path',
            attributes: {
              class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
              fill: 'currentColor',
              d: vectorData[1]
            }
          }]
        };
      } else {
        element = {
          tag: 'path',
          attributes: {
            fill: 'currentColor',
            d: vectorData
          }
        };
      }

      return {
        found: true,
        width: width,
        height: height,
        icon: element
      };
    }

    namespace.styles;

    var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible;\n}\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.225em;\n}\n.svg-inline--fa.fa-w-1 {\n  width: 0.0625em;\n}\n.svg-inline--fa.fa-w-2 {\n  width: 0.125em;\n}\n.svg-inline--fa.fa-w-3 {\n  width: 0.1875em;\n}\n.svg-inline--fa.fa-w-4 {\n  width: 0.25em;\n}\n.svg-inline--fa.fa-w-5 {\n  width: 0.3125em;\n}\n.svg-inline--fa.fa-w-6 {\n  width: 0.375em;\n}\n.svg-inline--fa.fa-w-7 {\n  width: 0.4375em;\n}\n.svg-inline--fa.fa-w-8 {\n  width: 0.5em;\n}\n.svg-inline--fa.fa-w-9 {\n  width: 0.5625em;\n}\n.svg-inline--fa.fa-w-10 {\n  width: 0.625em;\n}\n.svg-inline--fa.fa-w-11 {\n  width: 0.6875em;\n}\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em;\n}\n.svg-inline--fa.fa-w-13 {\n  width: 0.8125em;\n}\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em;\n}\n.svg-inline--fa.fa-w-15 {\n  width: 0.9375em;\n}\n.svg-inline--fa.fa-w-16 {\n  width: 1em;\n}\n.svg-inline--fa.fa-w-17 {\n  width: 1.0625em;\n}\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em;\n}\n.svg-inline--fa.fa-w-19 {\n  width: 1.1875em;\n}\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-border {\n  height: 1.5em;\n}\n.svg-inline--fa.fa-li {\n  width: 2em;\n}\n.svg-inline--fa.fa-fw {\n  width: 1.25em;\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: 0.25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -0.0667em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit;\n}\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: 0.1em;\n  padding: 0.2em 0.25em 0.15em;\n}\n\n.fa-pull-left {\n  float: left;\n}\n\n.fa-pull-right {\n  float: right;\n}\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: 0.3em;\n}\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: 0.3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical,\n:root .fa-flip-both {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse {\n  color: #fff;\n}";

    function css () {
      var dfp = DEFAULT_FAMILY_PREFIX;
      var drc = DEFAULT_REPLACEMENT_CLASS;
      var fp = config.familyPrefix;
      var rc = config.replacementClass;
      var s = baseStyles;

      if (fp !== dfp || rc !== drc) {
        var dPatt = new RegExp("\\.".concat(dfp, "\\-"), 'g');
        var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), 'g');
        var rPatt = new RegExp("\\.".concat(drc), 'g');
        s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
      }

      return s;
    }

    var Library =
    /*#__PURE__*/
    function () {
      function Library() {
        _classCallCheck(this, Library);

        this.definitions = {};
      }

      _createClass(Library, [{
        key: "add",
        value: function add() {
          var _this = this;

          for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
            definitions[_key] = arguments[_key];
          }

          var additions = definitions.reduce(this._pullDefinitions, {});
          Object.keys(additions).forEach(function (key) {
            _this.definitions[key] = _objectSpread({}, _this.definitions[key] || {}, additions[key]);
            defineIcons(key, additions[key]);
            build();
          });
        }
      }, {
        key: "reset",
        value: function reset() {
          this.definitions = {};
        }
      }, {
        key: "_pullDefinitions",
        value: function _pullDefinitions(additions, definition) {
          var normalized = definition.prefix && definition.iconName && definition.icon ? {
            0: definition
          } : definition;
          Object.keys(normalized).map(function (key) {
            var _normalized$key = normalized[key],
                prefix = _normalized$key.prefix,
                iconName = _normalized$key.iconName,
                icon = _normalized$key.icon;
            if (!additions[prefix]) additions[prefix] = {};
            additions[prefix][iconName] = icon;
          });
          return additions;
        }
      }]);

      return Library;
    }();

    function ensureCss() {
      if (config.autoAddCss && !_cssInserted) {
        insertCss(css());

        _cssInserted = true;
      }
    }

    function apiObject(val, abstractCreator) {
      Object.defineProperty(val, 'abstract', {
        get: abstractCreator
      });
      Object.defineProperty(val, 'html', {
        get: function get() {
          return val.abstract.map(function (a) {
            return toHtml(a);
          });
        }
      });
      Object.defineProperty(val, 'node', {
        get: function get() {
          if (!IS_DOM) return;
          var container = DOCUMENT$1.createElement('div');
          container.innerHTML = val.html;
          return container.children;
        }
      });
      return val;
    }

    function findIconDefinition(iconLookup) {
      var _iconLookup$prefix = iconLookup.prefix,
          prefix = _iconLookup$prefix === void 0 ? 'fa' : _iconLookup$prefix,
          iconName = iconLookup.iconName;
      if (!iconName) return;
      return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
    }

    function resolveIcons(next) {
      return function (maybeIconDefinition) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
        var mask = params.mask;

        if (mask) {
          mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
        }

        return next(iconDefinition, _objectSpread({}, params, {
          mask: mask
        }));
      };
    }

    var library = new Library();
    var _cssInserted = false;
    var parse$1 = {
      transform: function transform(transformString) {
        return parseTransformString(transformString);
      }
    };
    var icon = resolveIcons(function (iconDefinition) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _params$transform = params.transform,
          transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
          _params$symbol = params.symbol,
          symbol = _params$symbol === void 0 ? false : _params$symbol,
          _params$mask = params.mask,
          mask = _params$mask === void 0 ? null : _params$mask,
          _params$maskId = params.maskId,
          maskId = _params$maskId === void 0 ? null : _params$maskId,
          _params$title = params.title,
          title = _params$title === void 0 ? null : _params$title,
          _params$titleId = params.titleId,
          titleId = _params$titleId === void 0 ? null : _params$titleId,
          _params$classes = params.classes,
          classes = _params$classes === void 0 ? [] : _params$classes,
          _params$attributes = params.attributes,
          attributes = _params$attributes === void 0 ? {} : _params$attributes,
          _params$styles = params.styles,
          styles = _params$styles === void 0 ? {} : _params$styles;
      if (!iconDefinition) return;
      var prefix = iconDefinition.prefix,
          iconName = iconDefinition.iconName,
          icon = iconDefinition.icon;
      return apiObject(_objectSpread({
        type: 'icon'
      }, iconDefinition), function () {
        ensureCss();

        if (config.autoA11y) {
          if (title) {
            attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
          } else {
            attributes['aria-hidden'] = 'true';
            attributes['focusable'] = 'false';
          }
        }

        return makeInlineSvgAbstract({
          icons: {
            main: asFoundIcon(icon),
            mask: mask ? asFoundIcon(mask.icon) : {
              found: false,
              width: null,
              height: null,
              icon: {}
            }
          },
          prefix: prefix,
          iconName: iconName,
          transform: _objectSpread({}, meaninglessTransform, transform),
          symbol: symbol,
          title: title,
          maskId: maskId,
          titleId: titleId,
          extra: {
            attributes: attributes,
            styles: styles,
            classes: classes
          }
        });
      });
    });

    /* src/components/Icon.svelte generated by Svelte v3.44.1 */

    function create_fragment$7(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*html*/ ctx[0], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*html*/ 1) html_tag.p(/*html*/ ctx[0]);
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { size = undefined } = $$props;
    	let { spin = false } = $$props;
    	let { name } = $$props;
    	let { solid = true } = $$props;
    	let prefix = solid ? 'fas' : 'far';

    	let params = {
    		classes: [size ? `fa-${size}` : undefined, spin ? 'fa-spin' : undefined]
    	};

    	let html = '';

    	beforeUpdate(() => {
    		let iconObj = { prefix, iconName: name };
    		const result = icon(iconObj, params);
    		$$invalidate(0, html = result.html[0]);
    	});

    	const writable_props = ['size', 'spin', 'name', 'solid'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('spin' in $$props) $$invalidate(2, spin = $$props.spin);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('solid' in $$props) $$invalidate(4, solid = $$props.solid);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		beforeUpdate,
    		afterUpdate,
    		parse: parse$1,
    		icon,
    		findIconDefinition,
    		size,
    		spin,
    		name,
    		solid,
    		prefix,
    		params,
    		html
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('spin' in $$props) $$invalidate(2, spin = $$props.spin);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('solid' in $$props) $$invalidate(4, solid = $$props.solid);
    		if ('prefix' in $$props) prefix = $$props.prefix;
    		if ('params' in $$props) params = $$props.params;
    		if ('html' in $$props) $$invalidate(0, html = $$props.html);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [html, size, spin, name, solid];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, { size: 1, spin: 2, name: 3, solid: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[3] === undefined && !('name' in props)) {
    			console.warn("<Icon> was created without expected prop 'name'");
    		}
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get solid() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set solid(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Loading.svelte generated by Svelte v3.44.1 */
    const file$6 = "src/components/Loading.svelte";

    function add_css$4(target) {
    	append_styles(target, "svelte-hgmgbg", ".loading.svelte-hgmgbg{vertical-align:middle;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hZGluZy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBQ0ksUUFBQSxjQUFBLENBQUEsQUFDSSxjQUFBLENBQUEsTUFBc0IsQ0FDdEIsT0FBQSxDQUFBLElBQWEsQ0FDYixjQUFBLENBQUEsTUFBc0IsQ0FDdEIsZUFBQSxDQUFBLE1BQXVCLENBQ3ZCLFdBQUEsQ0FBQSxNQUFtQixDQUNuQixVQUFBLENBQUEsTUFBa0IsQUFDdEIsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJzcmMvY29tcG9uZW50cy9Mb2FkaW5nLnN2ZWx0ZSJdfQ== */");
    }

    // (1:0) <script lang="ts">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop$2,
    		m: noop$2,
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: noop$2
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }",
    		ctx
    	});

    	return block;
    }

    // (31:4) {:then resolved}
    function create_then_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(31:4) {:then resolved}",
    		ctx
    	});

    	return block;
    }

    // (23:21)          <div             class="loading"             bind:this="{node}
    function create_pending_block(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				name: "circle-notch",
    				spin: true,
    				size: "2x"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "loading svelte-hgmgbg");
    			set_style(div, "min-height", /*minHeight*/ ctx[1] + "px");
    			add_location(div, file$6, 23, 8, 1019);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			/*div_binding*/ ctx[7](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*minHeight*/ 2) {
    				set_style(div, "min-height", /*minHeight*/ ctx[1] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			/*div_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(23:21)          <div             class=\\\"loading\\\"             bind:this=\\\"{node}",
    		ctx
    	});

    	return block;
    }

    // (22:0) {#key update}
    function create_key_block$1(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 9,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*wait*/ ctx[4](/*ms*/ ctx[0]), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*ms*/ 1 && promise !== (promise = /*wait*/ ctx[4](/*ms*/ ctx[0])) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$1.name,
    		type: "key",
    		source: "(22:0) {#key update}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let previous_key = /*update*/ ctx[2];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block$1(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*update*/ 4 && safe_not_equal(previous_key, previous_key = /*update*/ ctx[2])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$2);
    				check_outros();
    				key_block = create_key_block$1(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, ['default']);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let { ms } = $$props;
    	let { minHeight = 0 } = $$props;
    	let { update = false } = $$props;
    	let node;

    	function wait(ms) {
    		return __awaiter(this, void 0, void 0, function* () {
    			yield new Promise(resolve => setTimeout(resolve, ms));
    		});
    	}

    	const writable_props = ['ms', 'minHeight', 'update'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			node = $$value;
    			$$invalidate(3, node);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('ms' in $$props) $$invalidate(0, ms = $$props.ms);
    		if ('minHeight' in $$props) $$invalidate(1, minHeight = $$props.minHeight);
    		if ('update' in $$props) $$invalidate(2, update = $$props.update);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		Icon,
    		ms,
    		minHeight,
    		update,
    		node,
    		wait
    	});

    	$$self.$inject_state = $$props => {
    		if ('__awaiter' in $$props) __awaiter = $$props.__awaiter;
    		if ('ms' in $$props) $$invalidate(0, ms = $$props.ms);
    		if ('minHeight' in $$props) $$invalidate(1, minHeight = $$props.minHeight);
    		if ('update' in $$props) $$invalidate(2, update = $$props.update);
    		if ('node' in $$props) $$invalidate(3, node = $$props.node);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ms, minHeight, update, node, wait, $$scope, slots, div_binding];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { ms: 0, minHeight: 1, update: 2 }, add_css$4);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ms*/ ctx[0] === undefined && !('ms' in props)) {
    			console.warn("<Loading> was created without expected prop 'ms'");
    		}
    	}

    	get ms() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ms(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minHeight() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minHeight(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get update() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set update(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ResultsView.svelte generated by Svelte v3.44.1 */
    const file$5 = "src/components/ResultsView.svelte";

    function add_css$3(target) {
    	append_styles(target, "svelte-uolj0q", "ol.svelte-uolj0q.svelte-uolj0q{padding-left:0;display:inline-block}.top-list-item.svelte-uolj0q.svelte-uolj0q{margin-bottom:0.2rem;list-style-type:none;list-style:none}.top-list-item.svelte-uolj0q.svelte-uolj0q:hover{cursor:pointer;background-color:var(--quizdown-color-secondary)}.top-list-item.svelte-uolj0q:hover .list-question.svelte-uolj0q{text-decoration:underline}.list-comment.svelte-uolj0q.svelte-uolj0q{margin-left:2em;list-style-type:initial}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdWx0c1ZpZXcuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQUNJLEVBQUEsNEJBQUEsQ0FBQSxBQUNJLFlBQUEsQ0FBQSxDQUFlLENBQ2YsT0FBQSxDQUFBLFlBQXFCLEFBQ3pCLENBQUEsQUFFQSxjQUFBLDRCQUFBLENBQUEsQUFDSSxhQUFBLENBQUEsTUFBcUIsQ0FDckIsZUFBQSxDQUFBLElBQXFCLENBQ3JCLFVBQUEsQ0FBQSxJQUFnQixBQUNwQixDQUFBLEFBRUEsMENBQUEsTUFBQSxBQUFBLENBQUEsQUFDSSxNQUFBLENBQUEsT0FBZSxDQUNmLGdCQUFBLENBQUEsSUFBQSwwQkFBQSxDQUFpRCxBQUNyRCxDQUFBLEFBRUEsNEJBQUEsTUFBQSxDQUFBLGNBQUEsY0FBQSxDQUFBLEFBQ0ksZUFBQSxDQUFBLFNBQTBCLEFBQzlCLENBQUEsQUFFQSxhQUFBLDRCQUFBLENBQUEsQUFDSSxXQUFBLENBQUEsR0FBZ0IsQ0FDaEIsZUFBQSxDQUFBLE9BQXdCLEFBQzVCLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvUmVzdWx0c1ZpZXcuc3ZlbHRlIl19 */");
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (42:28) {#if question.answers[selected].comment !== ''}
    function create_if_block$3(ctx) {
    	let li;
    	let i;
    	let raw0_value = /*question*/ ctx[6].answers[/*selected*/ ctx[9]].html + "";
    	let t0;
    	let html_tag;
    	let raw1_value = /*question*/ ctx[6].answers[/*selected*/ ctx[9]].comment + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			i = element("i");
    			t0 = text$1(":\n                                    ");
    			html_tag = new HtmlTag();
    			t1 = space();
    			add_location(i, file$5, 43, 36, 1469);
    			html_tag.a = t1;
    			attr_dev(li, "class", "list-comment svelte-uolj0q");
    			add_location(li, file$5, 42, 32, 1407);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, i);
    			i.innerHTML = raw0_value;
    			append_dev(li, t0);
    			html_tag.m(raw1_value, li);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*quiz*/ 1 && raw0_value !== (raw0_value = /*question*/ ctx[6].answers[/*selected*/ ctx[9]].html + "")) i.innerHTML = raw0_value;			if (dirty & /*quiz*/ 1 && raw1_value !== (raw1_value = /*question*/ ctx[6].answers[/*selected*/ ctx[9]].comment + "")) html_tag.p(raw1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(42:28) {#if question.answers[selected].comment !== ''}",
    		ctx
    	});

    	return block;
    }

    // (41:24) {#each question.selected as selected}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*question*/ ctx[6].answers[/*selected*/ ctx[9]].comment !== '' && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*question*/ ctx[6].answers[/*selected*/ ctx[9]].comment !== '') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(41:24) {#each question.selected as selected}",
    		ctx
    	});

    	return block;
    }

    // (33:12) {#each quiz.questions as question, i}
    function create_each_block$1(ctx) {
    	let li;
    	let span;
    	let t0_value = /*emojis*/ ctx[4][+/*question*/ ctx[6].solved] + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*question*/ ctx[6].text + "";
    	let t2;
    	let ol;
    	let t3;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*question*/ ctx[6].selected;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*i*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = space();
    			html_tag = new HtmlTag();
    			t2 = space();
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			html_tag.a = null;
    			attr_dev(span, "class", "list-question svelte-uolj0q");
    			add_location(span, file$5, 34, 20, 981);
    			attr_dev(ol, "class", "svelte-uolj0q");
    			add_location(ol, file$5, 38, 20, 1155);
    			attr_dev(li, "class", "top-list-item svelte-uolj0q");
    			add_location(li, file$5, 33, 16, 902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			html_tag.m(raw_value, span);
    			append_dev(li, t2);
    			append_dev(li, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*quiz*/ 1 && t0_value !== (t0_value = /*emojis*/ ctx[4][+/*question*/ ctx[6].solved] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*quiz*/ 1 && raw_value !== (raw_value = /*question*/ ctx[6].text + "")) html_tag.p(raw_value);

    			if (dirty & /*quiz*/ 1) {
    				each_value_1 = /*question*/ ctx[6].selected;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(33:12) {#each quiz.questions as question, i}",
    		ctx
    	});

    	return block;
    }

    // (25:0) <Loading ms="{waitTime}" minHeight="{150}">
    function create_default_slot$2(ctx) {
    	let div;
    	let h1;
    	let icon;
    	let t0;
    	let t1_value = format$1(/*points*/ ctx[2]) + "";
    	let t1;
    	let t2;
    	let t3_value = format$1(/*quiz*/ ctx[0].questions.length) + "";
    	let t3;
    	let t4;
    	let ol;
    	let div_intro;
    	let current;

    	icon = new Icon({
    			props: { name: "check-double" },
    			$$inline: true
    		});

    	let each_value = /*quiz*/ ctx[0].questions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			t1 = text$1(t1_value);
    			t2 = text$1("/");
    			t3 = text$1(t3_value);
    			t4 = space();
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$5, 26, 8, 701);
    			attr_dev(ol, "class", "svelte-uolj0q");
    			add_location(ol, file$5, 31, 8, 831);
    			add_location(div, file$5, 25, 4, 656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			mount_component(icon, h1, null);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(div, t4);
    			append_dev(div, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*points*/ 4) && t1_value !== (t1_value = format$1(/*points*/ ctx[2]) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*quiz*/ 1) && t3_value !== (t3_value = format$1(/*quiz*/ ctx[0].questions.length) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*quiz, emojis*/ 17) {
    				each_value = /*quiz*/ ctx[0].questions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 1000 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(25:0) <Loading ms=\\\"{waitTime}\\\" minHeight=\\\"{150}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let h3;
    	let t0_value = /*$_*/ ctx[3]('resultsTitle') + "";
    	let t0;
    	let t1;
    	let loading;
    	let current;

    	loading = new Loading({
    			props: {
    				ms: /*waitTime*/ ctx[1],
    				minHeight: 150,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text$1(t0_value);
    			t1 = space();
    			create_component(loading.$$.fragment);
    			add_location(h3, file$5, 23, 0, 578);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$_*/ 8) && t0_value !== (t0_value = /*$_*/ ctx[3]('resultsTitle') + "")) set_data_dev(t0, t0_value);
    			const loading_changes = {};
    			if (dirty & /*waitTime*/ 2) loading_changes.ms = /*waitTime*/ ctx[1];

    			if (dirty & /*$$scope, quiz, points*/ 4101) {
    				loading_changes.$$scope = { dirty, ctx };
    			}

    			loading.$set(loading_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function format$1(n) {
    	return n.toLocaleString('en-US', { minimumIntegerDigits: 2 });
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $_;
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(3, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ResultsView', slots, []);
    	let { quiz } = $$props;
    	let emojis = ['❌', '✅'];
    	let waitTime = 800;

    	if (get_store_value(quiz.isEvaluated)) {
    		// only wait longer for the first time
    		waitTime = 300;
    	}

    	let points = 0;
    	beforeUpdate(() => $$invalidate(2, points = quiz.evaluate()));
    	const writable_props = ['quiz'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ResultsView> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => quiz.jump(i);

    	$$self.$$set = $$props => {
    		if ('quiz' in $$props) $$invalidate(0, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		quiz,
    		emojis,
    		_: X,
    		fade,
    		Icon,
    		Loading,
    		get: get_store_value,
    		waitTime,
    		points,
    		format: format$1,
    		$_
    	});

    	$$self.$inject_state = $$props => {
    		if ('quiz' in $$props) $$invalidate(0, quiz = $$props.quiz);
    		if ('emojis' in $$props) $$invalidate(4, emojis = $$props.emojis);
    		if ('waitTime' in $$props) $$invalidate(1, waitTime = $$props.waitTime);
    		if ('points' in $$props) $$invalidate(2, points = $$props.points);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [quiz, waitTime, points, $_, emojis, click_handler];
    }

    class ResultsView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { quiz: 0 }, add_css$3);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResultsView",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[0] === undefined && !('quiz' in props)) {
    			console.warn("<ResultsView> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<ResultsView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<ResultsView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Animated.svelte generated by Svelte v3.44.1 */
    const file$4 = "src/components/Animated.svelte";

    // (14:0) {#key update}
    function create_key_block(ctx) {
    	let div;
    	let div_intro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "animated");
    			add_location(div, file$4, 14, 4, 354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 400 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(14:0) {#key update}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let previous_key = /*update*/ ctx[0];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*update*/ 1 && safe_not_equal(previous_key, previous_key = /*update*/ ctx[0])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$2);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Animated', slots, ['default']);
    	let { update } = $$props;
    	const writable_props = ['update'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Animated> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('update' in $$props) $$invalidate(0, update = $$props.update);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fade, update });

    	$$self.$inject_state = $$props => {
    		if ('update' in $$props) $$invalidate(0, update = $$props.update);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [update, $$scope, slots];
    }

    class Animated extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { update: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Animated",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*update*/ ctx[0] === undefined && !('update' in props)) {
    			console.warn("<Animated> was created without expected prop 'update'");
    		}
    	}

    	get update() {
    		throw new Error("<Animated>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set update(value) {
    		throw new Error("<Animated>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */
    var faArrowLeft = {
      prefix: 'fas',
      iconName: 'arrow-left',
      icon: [448, 512, [], "f060", "M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"]
    };
    var faArrowRight = {
      prefix: 'fas',
      iconName: 'arrow-right',
      icon: [448, 512, [], "f061", "M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"]
    };
    var faCheckDouble = {
      prefix: 'fas',
      iconName: 'check-double',
      icon: [512, 512, [], "f560", "M505 174.8l-39.6-39.6c-9.4-9.4-24.6-9.4-33.9 0L192 374.7 80.6 263.2c-9.4-9.4-24.6-9.4-33.9 0L7 302.9c-9.4 9.4-9.4 24.6 0 34L175 505c9.4 9.4 24.6 9.4 33.9 0l296-296.2c9.4-9.5 9.4-24.7.1-34zm-324.3 106c6.2 6.3 16.4 6.3 22.6 0l208-208.2c6.2-6.3 6.2-16.4 0-22.6L366.1 4.7c-6.2-6.3-16.4-6.3-22.6 0L192 156.2l-55.4-55.5c-6.2-6.3-16.4-6.3-22.6 0L68.7 146c-6.2 6.3-6.2 16.4 0 22.6l112 112.2z"]
    };
    var faCircleNotch = {
      prefix: 'fas',
      iconName: 'circle-notch',
      icon: [512, 512, [], "f1ce", "M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"]
    };
    var faRedo = {
      prefix: 'fas',
      iconName: 'redo',
      icon: [512, 512, [], "f01e", "M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"]
    };

    /*!
     * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */
    var faLightbulb = {
      prefix: 'far',
      iconName: 'lightbulb',
      icon: [352, 512, [], "f0eb", "M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"]
    };

    function registerIcons () {
        config.autoAddCss = false;
        library.add(faArrowLeft, faArrowRight, faRedo, faLightbulb, faCheckDouble, faCircleNotch);
    }

    /* src/components/Hint.svelte generated by Svelte v3.44.1 */
    const file$3 = "src/components/Hint.svelte";

    // (6:0) {#if show}
    function create_if_block$2(ctx) {
    	let p;
    	let t;
    	let html_tag;
    	let p_intro;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1("💡 ");
    			html_tag = new HtmlTag();
    			html_tag.a = null;
    			attr_dev(p, "class", "hint");
    			add_location(p, file$3, 6, 4, 120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			html_tag.m(/*hint*/ ctx[1], p);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hint*/ 2) html_tag.p(/*hint*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (local) {
    				if (!p_intro) {
    					add_render_callback(() => {
    						p_intro = create_in_transition(p, fade, { duration: 400 });
    						p_intro.start();
    					});
    				}
    			}
    		},
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(6:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*show*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hint', slots, []);
    	let { show } = $$props;
    	let { hint } = $$props;
    	const writable_props = ['show', 'hint'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hint> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('hint' in $$props) $$invalidate(1, hint = $$props.hint);
    	};

    	$$self.$capture_state = () => ({ fade, show, hint });

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('hint' in $$props) $$invalidate(1, hint = $$props.hint);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, hint];
    }

    class Hint extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { show: 0, hint: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hint",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*show*/ ctx[0] === undefined && !('show' in props)) {
    			console.warn("<Hint> was created without expected prop 'show'");
    		}

    		if (/*hint*/ ctx[1] === undefined && !('hint' in props)) {
    			console.warn("<Hint> was created without expected prop 'hint'");
    		}
    	}

    	get show() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hint() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hint(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Container.svelte generated by Svelte v3.44.1 */

    const file$2 = "src/components/Container.svelte";

    function add_css$2(target) {
    	append_styles(target, "svelte-7prvss", ".container.svelte-7prvss{padding:2px 16px;display:grid;align-items:start;overflow:hidden}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFpbmVyLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFDSSxVQUFBLGNBQUEsQ0FBQSxBQUNJLE9BQUEsQ0FBQSxHQUFBLENBQUEsSUFBaUIsQ0FDakIsT0FBQSxDQUFBLElBQWEsQ0FDYixXQUFBLENBQUEsS0FBa0IsQ0FDbEIsUUFBQSxDQUFBLE1BQWdCLEFBQ3BCLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvQ29udGFpbmVyLnN2ZWx0ZSJdfQ== */");
    }

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "container svelte-7prvss");
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {}, add_css$2);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    class ResultsOverview {
        getOverallPoints() {
            let overallPoints = 0;
            for (let key of Object.keys(localStorage)) {
                if (key.endsWith('.score')) {
                    overallPoints += parseInt(localStorage.getItem(key));
                }
            }
            console.log('overallPoints: ', overallPoints);
            return overallPoints;
        }
        getOverallMaxPoints() {
            let overallMaxPoints = 0;
            for (let key of Object.keys(localStorage)) {
                if (key.endsWith('.maxScore')) {
                    overallMaxPoints += parseInt(localStorage.getItem(key));
                }
            }
            console.log('overallMaxPoints: ', overallMaxPoints);
            return overallMaxPoints;
        }
        getQuizesNames() {
            let quizesNames = [];
            for (let key of Object.keys(localStorage)) {
                if (key.endsWith('.score')) {
                    quizesNames.push(key.split('.')[0]);
                }
            }
            console.log('quizesNames: ', quizesNames);
            return quizesNames;
        }
    }

    /* src/components/ResultsOverview.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;
    const file$1 = "src/components/ResultsOverview.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-lsjgq7", "ol.svelte-lsjgq7{padding-left:0;display:inline-block;margin-bottom:1rem}.top-list-item.svelte-lsjgq7{margin-bottom:0.2rem;list-style-type:none;list-style:none}.top-list-item.svelte-lsjgq7:hover{cursor:pointer;background-color:var(--quizdown-color-secondary)}.all-answers-correct.svelte-lsjgq7{color:green;font-weight:bold}.some-answers-correct.svelte-lsjgq7{color:darkgoldenrod}.no-answer-correct.svelte-lsjgq7{color:darkred}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdWx0c092ZXJ2aWV3LnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFDSSxFQUFBLGNBQUEsQ0FBQSxBQUNJLFlBQUEsQ0FBQSxDQUFlLENBQ2YsT0FBQSxDQUFBLFlBQXFCLENBQ3JCLGFBQUEsQ0FBQSxJQUFtQixBQUN2QixDQUFBLEFBRUEsY0FBQSxjQUFBLENBQUEsQUFDSSxhQUFBLENBQUEsTUFBcUIsQ0FDckIsZUFBQSxDQUFBLElBQXFCLENBQ3JCLFVBQUEsQ0FBQSxJQUFnQixBQUNwQixDQUFBLEFBRUEsNEJBQUEsTUFBQSxBQUFBLENBQUEsQUFDSSxNQUFBLENBQUEsT0FBZSxDQUNmLGdCQUFBLENBQUEsSUFBQSwwQkFBQSxDQUFpRCxBQUNyRCxDQUFBLEFBRUEsb0JBQUEsY0FBQSxDQUFBLEFBQ0ksS0FBQSxDQUFBLEtBQVksQ0FDWixXQUFBLENBQUEsSUFBaUIsQUFDckIsQ0FBQSxBQUVBLHFCQUFBLGNBQUEsQ0FBQSxBQUNJLEtBQUEsQ0FBQSxhQUFvQixBQUN4QixDQUFBLEFBRUEsa0JBQUEsY0FBQSxDQUFBLEFBQ0ksS0FBQSxDQUFBLE9BQWMsQUFDbEIsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJzcmMvY29tcG9uZW50cy9SZXN1bHRzT3ZlcnZpZXcuc3ZlbHRlIl19 */");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (50:20) {:else}
    function create_else_block$1(ctx) {
    	let span;
    	let t0_value = /*quizName*/ ctx[9] + "";
    	let t0;
    	let t1;
    	let t2_value = localStorage.getItem(/*quizName*/ ctx[9] + '.score') + "";
    	let t2;
    	let t3;
    	let t4_value = localStorage.getItem(/*quizName*/ ctx[9] + '.maxScore') + "";
    	let t4;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = text$1(": ");
    			t2 = text$1(t2_value);
    			t3 = text$1("/");
    			t4 = text$1(t4_value);
    			attr_dev(span, "class", "list-quiz some-answers-correct svelte-lsjgq7");
    			add_location(span, file$1, 50, 24, 2063);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(50:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:90) 
    function create_if_block_1$1(ctx) {
    	let span;
    	let t0_value = /*quizName*/ ctx[9] + "";
    	let t0;
    	let t1;
    	let t2_value = localStorage.getItem(/*quizName*/ ctx[9] + '.score') + "";
    	let t2;
    	let t3;
    	let t4_value = localStorage.getItem(/*quizName*/ ctx[9] + '.maxScore') + "";
    	let t4;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = text$1(": ");
    			t2 = text$1(t2_value);
    			t3 = text$1("/");
    			t4 = text$1(t4_value);
    			attr_dev(span, "class", "list-quiz no-answer-correct svelte-lsjgq7");
    			add_location(span, file$1, 46, 24, 1805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(46:90) ",
    		ctx
    	});

    	return block;
    }

    // (42:20) {#if (parseInt(localStorage.getItem(quizName + '.score'))/parseInt(localStorage.getItem(quizName + '.maxScore')) == 1)}
    function create_if_block$1(ctx) {
    	let span;
    	let t0_value = /*quizName*/ ctx[9] + "";
    	let t0;
    	let t1;
    	let t2_value = localStorage.getItem(/*quizName*/ ctx[9] + '.score') + "";
    	let t2;
    	let t3;
    	let t4_value = localStorage.getItem(/*quizName*/ ctx[9] + '.maxScore') + "";
    	let t4;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = text$1(": ");
    			t2 = text$1(t2_value);
    			t3 = text$1("/");
    			t4 = text$1(t4_value);
    			attr_dev(span, "class", "list-quiz all-answers-correct svelte-lsjgq7");
    			add_location(span, file$1, 42, 24, 1482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(42:20) {#if (parseInt(localStorage.getItem(quizName + '.score'))/parseInt(localStorage.getItem(quizName + '.maxScore')) == 1)}",
    		ctx
    	});

    	return block;
    }

    // (40:12) {#each resultsOverview.getQuizesNames() as quizName, i}
    function create_each_block(ctx) {
    	let li;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (parseInt(localStorage.getItem(/*quizName*/ ctx[9] + '.score')) / parseInt(localStorage.getItem(/*quizName*/ ctx[9] + '.maxScore')) == 1) return create_if_block$1;
    		if (parseInt(localStorage.getItem(/*quizName*/ ctx[9] + '.score')) == 0) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			attr_dev(li, "class", "top-list-item svelte-lsjgq7");
    			add_location(li, file$1, 40, 16, 1290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_block.m(li, null);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(40:12) {#each resultsOverview.getQuizesNames() as quizName, i}",
    		ctx
    	});

    	return block;
    }

    // (32:0) <Loading ms="{waitTime}" minHeight="{150}">
    function create_default_slot$1(ctx) {
    	let div;
    	let h1;
    	let icon;
    	let t0;
    	let t1_value = format(/*overallPoints*/ ctx[0]) + "";
    	let t1;
    	let t2;
    	let t3_value = format(/*overallMaxPoints*/ ctx[1]) + "";
    	let t3;
    	let t4;
    	let ol;
    	let div_intro;
    	let current;

    	icon = new Icon({
    			props: { name: "check-double" },
    			$$inline: true
    		});

    	let each_value = /*resultsOverview*/ ctx[3].getQuizesNames();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			t1 = text$1(t1_value);
    			t2 = text$1("/");
    			t3 = text$1(t3_value);
    			t4 = space();
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$1, 33, 8, 1069);
    			attr_dev(ol, "class", "svelte-lsjgq7");
    			add_location(ol, file$1, 38, 8, 1201);
    			add_location(div, file$1, 32, 4, 1024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			mount_component(icon, h1, null);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(div, t4);
    			append_dev(div, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*overallPoints*/ 1) && t1_value !== (t1_value = format(/*overallPoints*/ ctx[0]) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*overallMaxPoints*/ 2) && t3_value !== (t3_value = format(/*overallMaxPoints*/ ctx[1]) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*localStorage, resultsOverview, parseInt*/ 8) {
    				each_value = /*resultsOverview*/ ctx[3].getQuizesNames();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 1000 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(32:0) <Loading ms=\\\"{waitTime}\\\" minHeight=\\\"{150}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let h3;
    	let t0_value = /*$_*/ ctx[2]('overviewTitle') + "";
    	let t0;
    	let t1;
    	let loading;
    	let current;

    	loading = new Loading({
    			props: {
    				ms: /*waitTime*/ ctx[4],
    				minHeight: 150,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text$1(t0_value);
    			t1 = space();
    			create_component(loading.$$.fragment);
    			add_location(h3, file$1, 30, 0, 945);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$_*/ 4) && t0_value !== (t0_value = /*$_*/ ctx[2]('overviewTitle') + "")) set_data_dev(t0, t0_value);
    			const loading_changes = {};

    			if (dirty & /*$$scope, overallMaxPoints, overallPoints*/ 4099) {
    				loading_changes.$$scope = { dirty, ctx };
    			}

    			loading.$set(loading_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function format(n) {
    	return n.toLocaleString('en-US', { minimumIntegerDigits: 2 });
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $_;
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(2, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ResultsOverview', slots, []);
    	let emojis = ['❌', '✅'];
    	registerIcons();
    	let node;
    	let minHeight = 150;
    	let reloaded = false;
    	let resultsOverview = new ResultsOverview();

    	// let showModal = false;
    	let waitTime = 800;

    	let overallPoints = 0;
    	beforeUpdate(() => $$invalidate(0, overallPoints = resultsOverview.getOverallPoints()));
    	console.log('overallPoints: ', overallPoints);
    	let overallMaxPoints = 0;
    	beforeUpdate(() => $$invalidate(1, overallMaxPoints = resultsOverview.getOverallMaxPoints()));
    	console.log('overallMaxPoints: ', overallMaxPoints);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ResultsOverview> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ResultsOverview,
    		beforeUpdate,
    		emojis,
    		_: X,
    		fade,
    		Icon,
    		Loading,
    		onMount,
    		registerIcons,
    		node,
    		minHeight,
    		reloaded,
    		resultsOverview,
    		waitTime,
    		overallPoints,
    		overallMaxPoints,
    		format,
    		$_
    	});

    	$$self.$inject_state = $$props => {
    		if ('emojis' in $$props) emojis = $$props.emojis;
    		if ('node' in $$props) node = $$props.node;
    		if ('minHeight' in $$props) minHeight = $$props.minHeight;
    		if ('reloaded' in $$props) reloaded = $$props.reloaded;
    		if ('resultsOverview' in $$props) $$invalidate(3, resultsOverview = $$props.resultsOverview);
    		if ('waitTime' in $$props) $$invalidate(4, waitTime = $$props.waitTime);
    		if ('overallPoints' in $$props) $$invalidate(0, overallPoints = $$props.overallPoints);
    		if ('overallMaxPoints' in $$props) $$invalidate(1, overallMaxPoints = $$props.overallMaxPoints);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [overallPoints, overallMaxPoints, $_, resultsOverview, waitTime];
    }

    class ResultsOverview_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css$1);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResultsOverview_1",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */
    const file = "src/App.svelte";

    function add_css(target) {
    	append_styles(target, "svelte-k2exh3", ".hljs{display:block;overflow-x:auto;padding:0.5em;color:#333;background:#f8f8f8}.hljs-comment,.hljs-quote{color:#998;font-style:italic}.hljs-keyword,.hljs-selector-tag,.hljs-subst{color:#333;font-weight:bold}.hljs-number,.hljs-literal,.hljs-variable,.hljs-template-variable,.hljs-tag .hljs-attr{color:#008080}.hljs-string,.hljs-doctag{color:#d14}.hljs-title,.hljs-section,.hljs-selector-id{color:#900;font-weight:bold}.hljs-subst{font-weight:normal}.hljs-type,.hljs-class .hljs-title{color:#458;font-weight:bold}.hljs-tag,.hljs-name,.hljs-attribute{color:#000080;font-weight:normal}.hljs-regexp,.hljs-link{color:#009926}.hljs-symbol,.hljs-bullet{color:#990073}.hljs-built_in,.hljs-builtin-name{color:#0086b3}.hljs-meta{color:#999;font-weight:bold}.hljs-deletion{background:#fdd}.hljs-addition{background:#dfd}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:bold}@font-face{font-family:\"KaTeX_AMS\";src:url(fonts/KaTeX_AMS-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_AMS-Regular.woff) format(\"woff\"), url(fonts/KaTeX_AMS-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Caligraphic\";src:url(fonts/KaTeX_Caligraphic-Bold.woff2) format(\"woff2\"), url(fonts/KaTeX_Caligraphic-Bold.woff) format(\"woff\"), url(fonts/KaTeX_Caligraphic-Bold.ttf) format(\"truetype\");font-weight:bold;font-style:normal}@font-face{font-family:\"KaTeX_Caligraphic\";src:url(fonts/KaTeX_Caligraphic-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Caligraphic-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Caligraphic-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Fraktur\";src:url(fonts/KaTeX_Fraktur-Bold.woff2) format(\"woff2\"), url(fonts/KaTeX_Fraktur-Bold.woff) format(\"woff\"), url(fonts/KaTeX_Fraktur-Bold.ttf) format(\"truetype\");font-weight:bold;font-style:normal}@font-face{font-family:\"KaTeX_Fraktur\";src:url(fonts/KaTeX_Fraktur-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Fraktur-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Fraktur-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Main\";src:url(fonts/KaTeX_Main-Bold.woff2) format(\"woff2\"), url(fonts/KaTeX_Main-Bold.woff) format(\"woff\"), url(fonts/KaTeX_Main-Bold.ttf) format(\"truetype\");font-weight:bold;font-style:normal}@font-face{font-family:\"KaTeX_Main\";src:url(fonts/KaTeX_Main-BoldItalic.woff2) format(\"woff2\"), url(fonts/KaTeX_Main-BoldItalic.woff) format(\"woff\"), url(fonts/KaTeX_Main-BoldItalic.ttf) format(\"truetype\");font-weight:bold;font-style:italic}@font-face{font-family:\"KaTeX_Main\";src:url(fonts/KaTeX_Main-Italic.woff2) format(\"woff2\"), url(fonts/KaTeX_Main-Italic.woff) format(\"woff\"), url(fonts/KaTeX_Main-Italic.ttf) format(\"truetype\");font-weight:normal;font-style:italic}@font-face{font-family:\"KaTeX_Main\";src:url(fonts/KaTeX_Main-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Main-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Main-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Math\";src:url(fonts/KaTeX_Math-BoldItalic.woff2) format(\"woff2\"), url(fonts/KaTeX_Math-BoldItalic.woff) format(\"woff\"), url(fonts/KaTeX_Math-BoldItalic.ttf) format(\"truetype\");font-weight:bold;font-style:italic}@font-face{font-family:\"KaTeX_Math\";src:url(fonts/KaTeX_Math-Italic.woff2) format(\"woff2\"), url(fonts/KaTeX_Math-Italic.woff) format(\"woff\"), url(fonts/KaTeX_Math-Italic.ttf) format(\"truetype\");font-weight:normal;font-style:italic}@font-face{font-family:\"KaTeX_SansSerif\";src:url(fonts/KaTeX_SansSerif-Bold.woff2) format(\"woff2\"), url(fonts/KaTeX_SansSerif-Bold.woff) format(\"woff\"), url(fonts/KaTeX_SansSerif-Bold.ttf) format(\"truetype\");font-weight:bold;font-style:normal}@font-face{font-family:\"KaTeX_SansSerif\";src:url(fonts/KaTeX_SansSerif-Italic.woff2) format(\"woff2\"), url(fonts/KaTeX_SansSerif-Italic.woff) format(\"woff\"), url(fonts/KaTeX_SansSerif-Italic.ttf) format(\"truetype\");font-weight:normal;font-style:italic}@font-face{font-family:\"KaTeX_SansSerif\";src:url(fonts/KaTeX_SansSerif-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_SansSerif-Regular.woff) format(\"woff\"), url(fonts/KaTeX_SansSerif-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Script\";src:url(fonts/KaTeX_Script-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Script-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Script-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Size1\";src:url(fonts/KaTeX_Size1-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Size1-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Size1-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Size2\";src:url(fonts/KaTeX_Size2-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Size2-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Size2-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Size3\";src:url(fonts/KaTeX_Size3-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Size3-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Size3-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Size4\";src:url(fonts/KaTeX_Size4-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Size4-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Size4-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}@font-face{font-family:\"KaTeX_Typewriter\";src:url(fonts/KaTeX_Typewriter-Regular.woff2) format(\"woff2\"), url(fonts/KaTeX_Typewriter-Regular.woff) format(\"woff\"), url(fonts/KaTeX_Typewriter-Regular.ttf) format(\"truetype\");font-weight:normal;font-style:normal}.katex{font:normal 1.21em KaTeX_Main, Times New Roman, serif;line-height:1.2;text-indent:0;text-rendering:auto}.katex *{-ms-high-contrast-adjust:none !important;border-color:currentColor}.katex .katex-version::after{content:\"0.13.11\"}.katex .katex-mathml{position:absolute;clip:rect(1px, 1px, 1px, 1px);padding:0;border:0;height:1px;width:1px;overflow:hidden}.katex .katex-html{}.katex .katex-html>.newline{display:block}.katex .base{position:relative;display:inline-block;white-space:nowrap;width:-webkit-min-content;width:-moz-min-content;width:min-content}.katex .strut{display:inline-block}.katex .textbf{font-weight:bold}.katex .textit{font-style:italic}.katex .textrm{font-family:KaTeX_Main}.katex .textsf{font-family:KaTeX_SansSerif}.katex .texttt{font-family:KaTeX_Typewriter}.katex .mathnormal{font-family:KaTeX_Math;font-style:italic}.katex .mathit{font-family:KaTeX_Main;font-style:italic}.katex .mathrm{font-style:normal}.katex .mathbf{font-family:KaTeX_Main;font-weight:bold}.katex .boldsymbol{font-family:KaTeX_Math;font-weight:bold;font-style:italic}.katex .amsrm{font-family:KaTeX_AMS}.katex .mathbb,.katex .textbb{font-family:KaTeX_AMS}.katex .mathcal{font-family:KaTeX_Caligraphic}.katex .mathfrak,.katex .textfrak{font-family:KaTeX_Fraktur}.katex .mathtt{font-family:KaTeX_Typewriter}.katex .mathscr,.katex .textscr{font-family:KaTeX_Script}.katex .mathsf,.katex .textsf{font-family:KaTeX_SansSerif}.katex .mathboldsf,.katex .textboldsf{font-family:KaTeX_SansSerif;font-weight:bold}.katex .mathitsf,.katex .textitsf{font-family:KaTeX_SansSerif;font-style:italic}.katex .mainrm{font-family:KaTeX_Main;font-style:normal}.katex .vlist-t{display:inline-table;table-layout:fixed;border-collapse:collapse}.katex .vlist-r{display:table-row}.katex .vlist{display:table-cell;vertical-align:bottom;position:relative}.katex .vlist>span{display:block;height:0;position:relative}.katex .vlist>span>span{display:inline-block}.katex .vlist>span>.pstrut{overflow:hidden;width:0}.katex .vlist-t2{margin-right:-2px}.katex .vlist-s{display:table-cell;vertical-align:bottom;font-size:1px;width:2px;min-width:2px}.katex .vbox{display:-webkit-inline-box;display:inline-flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;-webkit-box-align:baseline;align-items:baseline}.katex .hbox{display:-webkit-inline-box;display:inline-flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;width:100%}.katex .thinbox{display:-webkit-inline-box;display:inline-flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;width:0;max-width:0}.katex .msupsub{text-align:left}.katex .mfrac>span>span{text-align:center}.katex .mfrac .frac-line{display:inline-block;width:100%;border-bottom-style:solid}.katex .mfrac .frac-line,.katex .overline .overline-line,.katex .underline .underline-line,.katex .hline,.katex .hdashline,.katex .rule{min-height:1px}.katex .mspace{display:inline-block}.katex .llap,.katex .rlap,.katex .clap{width:0;position:relative}.katex .llap>.inner,.katex .rlap>.inner,.katex .clap>.inner{position:absolute}.katex .llap>.fix,.katex .rlap>.fix,.katex .clap>.fix{display:inline-block}.katex .llap>.inner{right:0}.katex .rlap>.inner,.katex .clap>.inner{left:0}.katex .clap>.inner>span{margin-left:-50%;margin-right:50%}.katex .rule{display:inline-block;border:solid 0;position:relative}.katex .overline .overline-line,.katex .underline .underline-line,.katex .hline{display:inline-block;width:100%;border-bottom-style:solid}.katex .hdashline{display:inline-block;width:100%;border-bottom-style:dashed}.katex .sqrt>.root{margin-left:0.27777778em;margin-right:-0.55555556em}.katex .sizing.reset-size1.size1,.katex .fontsize-ensurer.reset-size1.size1{font-size:1em}.katex .sizing.reset-size1.size2,.katex .fontsize-ensurer.reset-size1.size2{font-size:1.2em}.katex .sizing.reset-size1.size3,.katex .fontsize-ensurer.reset-size1.size3{font-size:1.4em}.katex .sizing.reset-size1.size4,.katex .fontsize-ensurer.reset-size1.size4{font-size:1.6em}.katex .sizing.reset-size1.size5,.katex .fontsize-ensurer.reset-size1.size5{font-size:1.8em}.katex .sizing.reset-size1.size6,.katex .fontsize-ensurer.reset-size1.size6{font-size:2em}.katex .sizing.reset-size1.size7,.katex .fontsize-ensurer.reset-size1.size7{font-size:2.4em}.katex .sizing.reset-size1.size8,.katex .fontsize-ensurer.reset-size1.size8{font-size:2.88em}.katex .sizing.reset-size1.size9,.katex .fontsize-ensurer.reset-size1.size9{font-size:3.456em}.katex .sizing.reset-size1.size10,.katex .fontsize-ensurer.reset-size1.size10{font-size:4.148em}.katex .sizing.reset-size1.size11,.katex .fontsize-ensurer.reset-size1.size11{font-size:4.976em}.katex .sizing.reset-size2.size1,.katex .fontsize-ensurer.reset-size2.size1{font-size:0.83333333em}.katex .sizing.reset-size2.size2,.katex .fontsize-ensurer.reset-size2.size2{font-size:1em}.katex .sizing.reset-size2.size3,.katex .fontsize-ensurer.reset-size2.size3{font-size:1.16666667em}.katex .sizing.reset-size2.size4,.katex .fontsize-ensurer.reset-size2.size4{font-size:1.33333333em}.katex .sizing.reset-size2.size5,.katex .fontsize-ensurer.reset-size2.size5{font-size:1.5em}.katex .sizing.reset-size2.size6,.katex .fontsize-ensurer.reset-size2.size6{font-size:1.66666667em}.katex .sizing.reset-size2.size7,.katex .fontsize-ensurer.reset-size2.size7{font-size:2em}.katex .sizing.reset-size2.size8,.katex .fontsize-ensurer.reset-size2.size8{font-size:2.4em}.katex .sizing.reset-size2.size9,.katex .fontsize-ensurer.reset-size2.size9{font-size:2.88em}.katex .sizing.reset-size2.size10,.katex .fontsize-ensurer.reset-size2.size10{font-size:3.45666667em}.katex .sizing.reset-size2.size11,.katex .fontsize-ensurer.reset-size2.size11{font-size:4.14666667em}.katex .sizing.reset-size3.size1,.katex .fontsize-ensurer.reset-size3.size1{font-size:0.71428571em}.katex .sizing.reset-size3.size2,.katex .fontsize-ensurer.reset-size3.size2{font-size:0.85714286em}.katex .sizing.reset-size3.size3,.katex .fontsize-ensurer.reset-size3.size3{font-size:1em}.katex .sizing.reset-size3.size4,.katex .fontsize-ensurer.reset-size3.size4{font-size:1.14285714em}.katex .sizing.reset-size3.size5,.katex .fontsize-ensurer.reset-size3.size5{font-size:1.28571429em}.katex .sizing.reset-size3.size6,.katex .fontsize-ensurer.reset-size3.size6{font-size:1.42857143em}.katex .sizing.reset-size3.size7,.katex .fontsize-ensurer.reset-size3.size7{font-size:1.71428571em}.katex .sizing.reset-size3.size8,.katex .fontsize-ensurer.reset-size3.size8{font-size:2.05714286em}.katex .sizing.reset-size3.size9,.katex .fontsize-ensurer.reset-size3.size9{font-size:2.46857143em}.katex .sizing.reset-size3.size10,.katex .fontsize-ensurer.reset-size3.size10{font-size:2.96285714em}.katex .sizing.reset-size3.size11,.katex .fontsize-ensurer.reset-size3.size11{font-size:3.55428571em}.katex .sizing.reset-size4.size1,.katex .fontsize-ensurer.reset-size4.size1{font-size:0.625em}.katex .sizing.reset-size4.size2,.katex .fontsize-ensurer.reset-size4.size2{font-size:0.75em}.katex .sizing.reset-size4.size3,.katex .fontsize-ensurer.reset-size4.size3{font-size:0.875em}.katex .sizing.reset-size4.size4,.katex .fontsize-ensurer.reset-size4.size4{font-size:1em}.katex .sizing.reset-size4.size5,.katex .fontsize-ensurer.reset-size4.size5{font-size:1.125em}.katex .sizing.reset-size4.size6,.katex .fontsize-ensurer.reset-size4.size6{font-size:1.25em}.katex .sizing.reset-size4.size7,.katex .fontsize-ensurer.reset-size4.size7{font-size:1.5em}.katex .sizing.reset-size4.size8,.katex .fontsize-ensurer.reset-size4.size8{font-size:1.8em}.katex .sizing.reset-size4.size9,.katex .fontsize-ensurer.reset-size4.size9{font-size:2.16em}.katex .sizing.reset-size4.size10,.katex .fontsize-ensurer.reset-size4.size10{font-size:2.5925em}.katex .sizing.reset-size4.size11,.katex .fontsize-ensurer.reset-size4.size11{font-size:3.11em}.katex .sizing.reset-size5.size1,.katex .fontsize-ensurer.reset-size5.size1{font-size:0.55555556em}.katex .sizing.reset-size5.size2,.katex .fontsize-ensurer.reset-size5.size2{font-size:0.66666667em}.katex .sizing.reset-size5.size3,.katex .fontsize-ensurer.reset-size5.size3{font-size:0.77777778em}.katex .sizing.reset-size5.size4,.katex .fontsize-ensurer.reset-size5.size4{font-size:0.88888889em}.katex .sizing.reset-size5.size5,.katex .fontsize-ensurer.reset-size5.size5{font-size:1em}.katex .sizing.reset-size5.size6,.katex .fontsize-ensurer.reset-size5.size6{font-size:1.11111111em}.katex .sizing.reset-size5.size7,.katex .fontsize-ensurer.reset-size5.size7{font-size:1.33333333em}.katex .sizing.reset-size5.size8,.katex .fontsize-ensurer.reset-size5.size8{font-size:1.6em}.katex .sizing.reset-size5.size9,.katex .fontsize-ensurer.reset-size5.size9{font-size:1.92em}.katex .sizing.reset-size5.size10,.katex .fontsize-ensurer.reset-size5.size10{font-size:2.30444444em}.katex .sizing.reset-size5.size11,.katex .fontsize-ensurer.reset-size5.size11{font-size:2.76444444em}.katex .sizing.reset-size6.size1,.katex .fontsize-ensurer.reset-size6.size1{font-size:0.5em}.katex .sizing.reset-size6.size2,.katex .fontsize-ensurer.reset-size6.size2{font-size:0.6em}.katex .sizing.reset-size6.size3,.katex .fontsize-ensurer.reset-size6.size3{font-size:0.7em}.katex .sizing.reset-size6.size4,.katex .fontsize-ensurer.reset-size6.size4{font-size:0.8em}.katex .sizing.reset-size6.size5,.katex .fontsize-ensurer.reset-size6.size5{font-size:0.9em}.katex .sizing.reset-size6.size6,.katex .fontsize-ensurer.reset-size6.size6{font-size:1em}.katex .sizing.reset-size6.size7,.katex .fontsize-ensurer.reset-size6.size7{font-size:1.2em}.katex .sizing.reset-size6.size8,.katex .fontsize-ensurer.reset-size6.size8{font-size:1.44em}.katex .sizing.reset-size6.size9,.katex .fontsize-ensurer.reset-size6.size9{font-size:1.728em}.katex .sizing.reset-size6.size10,.katex .fontsize-ensurer.reset-size6.size10{font-size:2.074em}.katex .sizing.reset-size6.size11,.katex .fontsize-ensurer.reset-size6.size11{font-size:2.488em}.katex .sizing.reset-size7.size1,.katex .fontsize-ensurer.reset-size7.size1{font-size:0.41666667em}.katex .sizing.reset-size7.size2,.katex .fontsize-ensurer.reset-size7.size2{font-size:0.5em}.katex .sizing.reset-size7.size3,.katex .fontsize-ensurer.reset-size7.size3{font-size:0.58333333em}.katex .sizing.reset-size7.size4,.katex .fontsize-ensurer.reset-size7.size4{font-size:0.66666667em}.katex .sizing.reset-size7.size5,.katex .fontsize-ensurer.reset-size7.size5{font-size:0.75em}.katex .sizing.reset-size7.size6,.katex .fontsize-ensurer.reset-size7.size6{font-size:0.83333333em}.katex .sizing.reset-size7.size7,.katex .fontsize-ensurer.reset-size7.size7{font-size:1em}.katex .sizing.reset-size7.size8,.katex .fontsize-ensurer.reset-size7.size8{font-size:1.2em}.katex .sizing.reset-size7.size9,.katex .fontsize-ensurer.reset-size7.size9{font-size:1.44em}.katex .sizing.reset-size7.size10,.katex .fontsize-ensurer.reset-size7.size10{font-size:1.72833333em}.katex .sizing.reset-size7.size11,.katex .fontsize-ensurer.reset-size7.size11{font-size:2.07333333em}.katex .sizing.reset-size8.size1,.katex .fontsize-ensurer.reset-size8.size1{font-size:0.34722222em}.katex .sizing.reset-size8.size2,.katex .fontsize-ensurer.reset-size8.size2{font-size:0.41666667em}.katex .sizing.reset-size8.size3,.katex .fontsize-ensurer.reset-size8.size3{font-size:0.48611111em}.katex .sizing.reset-size8.size4,.katex .fontsize-ensurer.reset-size8.size4{font-size:0.55555556em}.katex .sizing.reset-size8.size5,.katex .fontsize-ensurer.reset-size8.size5{font-size:0.625em}.katex .sizing.reset-size8.size6,.katex .fontsize-ensurer.reset-size8.size6{font-size:0.69444444em}.katex .sizing.reset-size8.size7,.katex .fontsize-ensurer.reset-size8.size7{font-size:0.83333333em}.katex .sizing.reset-size8.size8,.katex .fontsize-ensurer.reset-size8.size8{font-size:1em}.katex .sizing.reset-size8.size9,.katex .fontsize-ensurer.reset-size8.size9{font-size:1.2em}.katex .sizing.reset-size8.size10,.katex .fontsize-ensurer.reset-size8.size10{font-size:1.44027778em}.katex .sizing.reset-size8.size11,.katex .fontsize-ensurer.reset-size8.size11{font-size:1.72777778em}.katex .sizing.reset-size9.size1,.katex .fontsize-ensurer.reset-size9.size1{font-size:0.28935185em}.katex .sizing.reset-size9.size2,.katex .fontsize-ensurer.reset-size9.size2{font-size:0.34722222em}.katex .sizing.reset-size9.size3,.katex .fontsize-ensurer.reset-size9.size3{font-size:0.40509259em}.katex .sizing.reset-size9.size4,.katex .fontsize-ensurer.reset-size9.size4{font-size:0.46296296em}.katex .sizing.reset-size9.size5,.katex .fontsize-ensurer.reset-size9.size5{font-size:0.52083333em}.katex .sizing.reset-size9.size6,.katex .fontsize-ensurer.reset-size9.size6{font-size:0.5787037em}.katex .sizing.reset-size9.size7,.katex .fontsize-ensurer.reset-size9.size7{font-size:0.69444444em}.katex .sizing.reset-size9.size8,.katex .fontsize-ensurer.reset-size9.size8{font-size:0.83333333em}.katex .sizing.reset-size9.size9,.katex .fontsize-ensurer.reset-size9.size9{font-size:1em}.katex .sizing.reset-size9.size10,.katex .fontsize-ensurer.reset-size9.size10{font-size:1.20023148em}.katex .sizing.reset-size9.size11,.katex .fontsize-ensurer.reset-size9.size11{font-size:1.43981481em}.katex .sizing.reset-size10.size1,.katex .fontsize-ensurer.reset-size10.size1{font-size:0.24108004em}.katex .sizing.reset-size10.size2,.katex .fontsize-ensurer.reset-size10.size2{font-size:0.28929605em}.katex .sizing.reset-size10.size3,.katex .fontsize-ensurer.reset-size10.size3{font-size:0.33751205em}.katex .sizing.reset-size10.size4,.katex .fontsize-ensurer.reset-size10.size4{font-size:0.38572806em}.katex .sizing.reset-size10.size5,.katex .fontsize-ensurer.reset-size10.size5{font-size:0.43394407em}.katex .sizing.reset-size10.size6,.katex .fontsize-ensurer.reset-size10.size6{font-size:0.48216008em}.katex .sizing.reset-size10.size7,.katex .fontsize-ensurer.reset-size10.size7{font-size:0.57859209em}.katex .sizing.reset-size10.size8,.katex .fontsize-ensurer.reset-size10.size8{font-size:0.69431051em}.katex .sizing.reset-size10.size9,.katex .fontsize-ensurer.reset-size10.size9{font-size:0.83317261em}.katex .sizing.reset-size10.size10,.katex .fontsize-ensurer.reset-size10.size10{font-size:1em}.katex .sizing.reset-size10.size11,.katex .fontsize-ensurer.reset-size10.size11{font-size:1.19961427em}.katex .sizing.reset-size11.size1,.katex .fontsize-ensurer.reset-size11.size1{font-size:0.20096463em}.katex .sizing.reset-size11.size2,.katex .fontsize-ensurer.reset-size11.size2{font-size:0.24115756em}.katex .sizing.reset-size11.size3,.katex .fontsize-ensurer.reset-size11.size3{font-size:0.28135048em}.katex .sizing.reset-size11.size4,.katex .fontsize-ensurer.reset-size11.size4{font-size:0.32154341em}.katex .sizing.reset-size11.size5,.katex .fontsize-ensurer.reset-size11.size5{font-size:0.36173633em}.katex .sizing.reset-size11.size6,.katex .fontsize-ensurer.reset-size11.size6{font-size:0.40192926em}.katex .sizing.reset-size11.size7,.katex .fontsize-ensurer.reset-size11.size7{font-size:0.48231511em}.katex .sizing.reset-size11.size8,.katex .fontsize-ensurer.reset-size11.size8{font-size:0.57877814em}.katex .sizing.reset-size11.size9,.katex .fontsize-ensurer.reset-size11.size9{font-size:0.69453376em}.katex .sizing.reset-size11.size10,.katex .fontsize-ensurer.reset-size11.size10{font-size:0.83360129em}.katex .sizing.reset-size11.size11,.katex .fontsize-ensurer.reset-size11.size11{font-size:1em}.katex .delimsizing.size1{font-family:KaTeX_Size1}.katex .delimsizing.size2{font-family:KaTeX_Size2}.katex .delimsizing.size3{font-family:KaTeX_Size3}.katex .delimsizing.size4{font-family:KaTeX_Size4}.katex .delimsizing.mult .delim-size1>span{font-family:KaTeX_Size1}.katex .delimsizing.mult .delim-size4>span{font-family:KaTeX_Size4}.katex .nulldelimiter{display:inline-block;width:0.12em}.katex .delimcenter{position:relative}.katex .op-symbol{position:relative}.katex .op-symbol.small-op{font-family:KaTeX_Size1}.katex .op-symbol.large-op{font-family:KaTeX_Size2}.katex .op-limits>.vlist-t{text-align:center}.katex .accent>.vlist-t{text-align:center}.katex .accent .accent-body{position:relative}.katex .accent .accent-body:not(.accent-full){width:0}.katex .overlay{display:block}.katex .mtable .vertical-separator{display:inline-block;min-width:1px}.katex .mtable .arraycolsep{display:inline-block}.katex .mtable .col-align-c>.vlist-t{text-align:center}.katex .mtable .col-align-l>.vlist-t{text-align:left}.katex .mtable .col-align-r>.vlist-t{text-align:right}.katex .svg-align{text-align:left}.katex svg{display:block;position:absolute;width:100%;height:inherit;fill:currentColor;stroke:currentColor;fill-rule:nonzero;fill-opacity:1;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1}.katex svg path{stroke:none}.katex img{border-style:none;min-width:0;min-height:0;max-width:none;max-height:none}.katex .stretchy{width:100%;display:block;position:relative;overflow:hidden}.katex .stretchy::before,.katex .stretchy::after{content:\"\"}.katex .hide-tail{width:100%;position:relative;overflow:hidden}.katex .halfarrow-left{position:absolute;left:0;width:50.2%;overflow:hidden}.katex .halfarrow-right{position:absolute;right:0;width:50.2%;overflow:hidden}.katex .brace-left{position:absolute;left:0;width:25.1%;overflow:hidden}.katex .brace-center{position:absolute;left:25%;width:50%;overflow:hidden}.katex .brace-right{position:absolute;right:0;width:25.1%;overflow:hidden}.katex .x-arrow-pad{padding:0 0.5em}.katex .cd-arrow-pad{padding:0 0.55556em 0 0.27778em}.katex .x-arrow,.katex .mover,.katex .munder{text-align:center}.katex .boxpad{padding:0 0.3em 0 0.3em}.katex .fbox,.katex .fcolorbox{box-sizing:border-box;border:0.04em solid}.katex .cancel-pad{padding:0 0.2em 0 0.2em}.katex .cancel-lap{margin-left:-0.2em;margin-right:-0.2em}.katex .sout{border-bottom-style:solid;border-bottom-width:0.08em}.katex .angl{box-sizing:border-content;border-top:0.049em solid;border-right:0.049em solid;margin-right:0.03889em}.katex .anglpad{padding:0 0.03889em 0 0.03889em}.katex .eqn-num::before{counter-increment:katexEqnNo;content:\"(\" counter(katexEqnNo) \")\"}.katex .mml-eqn-num::before{counter-increment:mmlEqnNo;content:\"(\" counter(mmlEqnNo) \")\"}.katex .mtr-glue{width:50%}.katex .cd-vert-arrow{display:inline-block;position:relative}.katex .cd-label-left{display:inline-block;position:absolute;right:-webkit-calc(50% + 0.3em);right:calc(50% + 0.3em);text-align:left}.katex .cd-label-right{display:inline-block;position:absolute;left:-webkit-calc(50% + 0.3em);left:calc(50% + 0.3em);text-align:right}.katex-display{display:block;margin:1em 0;text-align:center}.katex-display>.katex{display:block;text-align:center;white-space:nowrap}.katex-display>.katex>.katex-html{display:block;position:relative}.katex-display>.katex>.katex-html>.tag{position:absolute;right:0}.katex-display.leqno>.katex>.katex-html>.tag{left:0;right:auto}.katex-display.fleqn>.katex{text-align:left;padding-left:2em}body{counter-reset:katexEqnNo mmlEqnNo}svg:not(:root).svg-inline--fa{overflow:visible}.svg-inline--fa{display:inline-block;font-size:inherit;height:1em;overflow:visible;vertical-align:-0.125em}.svg-inline--fa.fa-lg{vertical-align:-0.225em}.svg-inline--fa.fa-w-1{width:0.0625em}.svg-inline--fa.fa-w-2{width:0.125em}.svg-inline--fa.fa-w-3{width:0.1875em}.svg-inline--fa.fa-w-4{width:0.25em}.svg-inline--fa.fa-w-5{width:0.3125em}.svg-inline--fa.fa-w-6{width:0.375em}.svg-inline--fa.fa-w-7{width:0.4375em}.svg-inline--fa.fa-w-8{width:0.5em}.svg-inline--fa.fa-w-9{width:0.5625em}.svg-inline--fa.fa-w-10{width:0.625em}.svg-inline--fa.fa-w-11{width:0.6875em}.svg-inline--fa.fa-w-12{width:0.75em}.svg-inline--fa.fa-w-13{width:0.8125em}.svg-inline--fa.fa-w-14{width:0.875em}.svg-inline--fa.fa-w-15{width:0.9375em}.svg-inline--fa.fa-w-16{width:1em}.svg-inline--fa.fa-w-17{width:1.0625em}.svg-inline--fa.fa-w-18{width:1.125em}.svg-inline--fa.fa-w-19{width:1.1875em}.svg-inline--fa.fa-w-20{width:1.25em}.svg-inline--fa.fa-pull-left{margin-right:0.3em;width:auto}.svg-inline--fa.fa-pull-right{margin-left:0.3em;width:auto}.svg-inline--fa.fa-border{height:1.5em}.svg-inline--fa.fa-li{width:2em}.svg-inline--fa.fa-fw{width:1.25em}.fa-layers svg.svg-inline--fa{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.fa-layers{display:inline-block;height:1em;position:relative;text-align:center;vertical-align:-0.125em;width:1em}.fa-layers svg.svg-inline--fa{-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-text,.fa-layers-counter{display:inline-block;position:absolute;text-align:center}.fa-layers-text{left:50%;top:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter{background-color:#ff253a;border-radius:1em;-webkit-box-sizing:border-box;box-sizing:border-box;color:#fff;height:1.5em;line-height:1;max-width:5em;min-width:1.5em;overflow:hidden;padding:0.25em;right:0;text-overflow:ellipsis;top:0;-webkit-transform:scale(0.25);transform:scale(0.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-bottom-right{bottom:0;right:0;top:auto;-webkit-transform:scale(0.25);transform:scale(0.25);-webkit-transform-origin:bottom right;transform-origin:bottom right}.fa-layers-bottom-left{bottom:0;left:0;right:auto;top:auto;-webkit-transform:scale(0.25);transform:scale(0.25);-webkit-transform-origin:bottom left;transform-origin:bottom left}.fa-layers-top-right{right:0;top:0;-webkit-transform:scale(0.25);transform:scale(0.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-top-left{left:0;right:auto;top:0;-webkit-transform:scale(0.25);transform:scale(0.25);-webkit-transform-origin:top left;transform-origin:top left}.fa-lg{font-size:1.33333em;line-height:0.75em;vertical-align:-0.0667em}.fa-xs{font-size:0.75em}.fa-sm{font-size:0.875em}.fa-1x{font-size:1em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-6x{font-size:6em}.fa-7x{font-size:7em}.fa-8x{font-size:8em}.fa-9x{font-size:9em}.fa-10x{font-size:10em}.fa-fw{text-align:center;width:1.25em}.fa-ul{list-style-type:none;margin-left:2.5em;padding-left:0}.fa-ul>li{position:relative}.fa-li{left:-2em;position:absolute;text-align:center;width:2em;line-height:inherit}.fa-border{border:solid 0.08em #eee;border-radius:0.1em;padding:0.2em 0.25em 0.15em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left,.fas.fa-pull-left,.far.fa-pull-left,.fal.fa-pull-left,.fab.fa-pull-left{margin-right:0.3em}.fa.fa-pull-right,.fas.fa-pull-right,.far.fa-pull-right,.fal.fa-pull-right,.fab.fa-pull-right{margin-left:0.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.fa-rotate-90{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";-webkit-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";-webkit-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";-webkit-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";-webkit-transform:scale(-1, 1);transform:scale(-1, 1)}.fa-flip-vertical{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";-webkit-transform:scale(1, -1);transform:scale(1, -1)}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";-webkit-transform:scale(-1, -1);transform:scale(-1, -1)}:root .fa-rotate-90,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-flip-horizontal,:root .fa-flip-vertical,:root .fa-flip-both{-webkit-filter:none;filter:none}.fa-stack{display:inline-block;height:2em;position:relative;width:2.5em}.fa-stack-1x,.fa-stack-2x{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.svg-inline--fa.fa-stack-1x{height:1em;width:1.25em}.svg-inline--fa.fa-stack-2x{height:2em;width:2.5em}.fa-inverse{color:#fff}.sr-only{border:0;clip:rect(0, 0, 0, 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.sr-only-focusable:active,.sr-only-focusable:focus{clip:auto;height:auto;margin:0;overflow:visible;position:static;width:auto}.svg-inline--fa .fa-primary{fill:var(--fa-primary-color, currentColor);opacity:1;opacity:var(--fa-primary-opacity, 1)}.svg-inline--fa .fa-secondary{fill:var(--fa-secondary-color, currentColor);opacity:0.4;opacity:var(--fa-secondary-opacity, 0.4)}.svg-inline--fa.fa-swap-opacity .fa-primary{opacity:0.4;opacity:var(--fa-secondary-opacity, 0.4)}.svg-inline--fa.fa-swap-opacity .fa-secondary{opacity:1;opacity:var(--fa-primary-opacity, 1)}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary{fill:black}.fad.fa-inverse{color:#fff}img{max-height:400px;border-radius:4px;max-width:100%;height:auto}code{padding:0 0.4rem;font-size:85%;color:#333;white-space:pre-wrap;border-radius:4px;padding:0.2em 0.4em;background-color:#f8f8f8;font-family:Consolas, Monaco, monospace}a{color:var(--quizdown-color-primary)}.quizdown-content{padding:1rem;max-width:900px;margin:auto}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFNQSxLQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxLQUFBLENBQ0EsVUFBQSxDQUFBLElBQUEsQ0FDQSxPQUFBLENBQUEsS0FBQSxDQUNBLEtBQUEsQ0FBQSxJQUFBLENBQ0EsVUFBQSxDQUFBLE9BQUEsQUNBRixDQUFBLEFER0EsYUFBQSxBQUFBLGFBRUUsS0FBQSxDQUFBLElBQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBQ0FGLENBQUEsQURHQSxhQUFBLEFBQUEsZ0NBR0UsS0FBQSxDQUFBLElBQUEsQ0FDQSxXQUFBLENBQUEsSUFBQSxBQ0FGLENBQUEsQURHQSxZQUFBLEFBQUEsMkVBS0UsS0FBQSxDQUFBLE9BQUEsQUNBRixDQUFBLEFER0EsWUFBQSxBQUFBLGNBRUUsS0FBQSxDQUFBLElBQUEsQUNBRixDQUFBLEFER0EsV0FBQSxBQUFBLGlDQUdFLEtBQUEsQ0FBQSxJQUFBLENBQ0EsV0FBQSxDQUFBLElBQUEsQUNBRixDQUFBLEFER0EsV0FBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsTUFBQSxBQ0FGLENBQUEsQURHQSxVQUFBLEFBQUEseUJBRUUsS0FBQSxDQUFBLElBQUEsQ0FDQSxXQUFBLENBQUEsSUFBQSxBQ0FGLENBQUEsQURHQSxTQUFBLEFBQUEsNEJBR0UsS0FBQSxDQUFBLE9BQUEsQ0FDQSxXQUFBLENBQUEsTUFBQSxBQ0FGLENBQUEsQURHQSxZQUFBLEFBQUEsWUFFRSxLQUFBLENBQUEsT0FBQSxBQ0FGLENBQUEsQURHQSxZQUFBLEFBQUEsY0FFRSxLQUFBLENBQUEsT0FBQSxBQ0FGLENBQUEsQURHQSxjQUFBLEFBQUEsb0JBRUUsS0FBQSxDQUFBLE9BQUEsQUNBRixDQUFBLEFER0EsVUFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsSUFBQSxDQUNBLFdBQUEsQ0FBQSxJQUFBLEFDQUYsQ0FBQSxBREdBLGNBQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLElBQUEsQUNBRixDQUFBLEFER0EsY0FBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsSUFBQSxBQ0FGLENBQUEsQURHQSxjQUFBLEFBQUEsQ0FBQSxBQUNFLFVBQUEsQ0FBQSxNQUFBLEFDQUYsQ0FBQSxBREdBLFlBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLElBQUEsQUNBRixDQUFBLEFDaEdBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLFdBQUEsQ0FDQSxHQUFBLENBQUEsSUFBQSw2QkFBQSxDQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsNEJBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLDJCQUFBLENBQUEsQ0FBQSxPQUFBLFVBQUEsQ0FBQSxDQUNBLFdBQUEsQ0FBQSxNQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQURvR0YsQ0FBQSxBQ2xHQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxtQkFBQSxDQUNBLEdBQUEsQ0FBQSxJQUFBLGtDQUFBLENBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxpQ0FBQSxDQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsZ0NBQUEsQ0FBQSxDQUFBLE9BQUEsVUFBQSxDQUFBLENBQ0EsV0FBQSxDQUFBLElBQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBRG9HRixDQUFBLEFDbEdBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLG1CQUFBLENBQ0EsR0FBQSxDQUFBLElBQUEscUNBQUEsQ0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLG9DQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxtQ0FBQSxDQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsQ0FDQSxXQUFBLENBQUEsTUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEb0dGLENBQUEsQUNsR0EsVUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsZUFBQSxDQUNBLEdBQUEsQ0FBQSxJQUFBLDhCQUFBLENBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSw2QkFBQSxDQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsNEJBQUEsQ0FBQSxDQUFBLE9BQUEsVUFBQSxDQUFBLENBQ0EsV0FBQSxDQUFBLElBQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBRG9HRixDQUFBLEFDbEdBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLGVBQUEsQ0FDQSxHQUFBLENBQUEsSUFBQSxpQ0FBQSxDQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsZ0NBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLCtCQUFBLENBQUEsQ0FBQSxPQUFBLFVBQUEsQ0FBQSxDQUNBLFdBQUEsQ0FBQSxNQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQURvR0YsQ0FBQSxBQ2xHQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxZQUFBLENBQ0EsR0FBQSxDQUFBLElBQUEsMkJBQUEsQ0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLDBCQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSx5QkFBQSxDQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsQ0FDQSxXQUFBLENBQUEsSUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEb0dGLENBQUEsQUNsR0EsVUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsWUFBQSxDQUNBLEdBQUEsQ0FBQSxJQUFBLGlDQUFBLENBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxnQ0FBQSxDQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsK0JBQUEsQ0FBQSxDQUFBLE9BQUEsVUFBQSxDQUFBLENBQ0EsV0FBQSxDQUFBLElBQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBRG9HRixDQUFBLEFDbEdBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLFlBQUEsQ0FDQSxHQUFBLENBQUEsSUFBQSw2QkFBQSxDQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsNEJBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLDJCQUFBLENBQUEsQ0FBQSxPQUFBLFVBQUEsQ0FBQSxDQUNBLFdBQUEsQ0FBQSxNQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQURvR0YsQ0FBQSxBQ2xHQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxZQUFBLENBQ0EsR0FBQSxDQUFBLElBQUEsOEJBQUEsQ0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLDZCQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSw0QkFBQSxDQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsQ0FDQSxXQUFBLENBQUEsTUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEb0dGLENBQUEsQUNsR0EsVUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsWUFBQSxDQUNBLEdBQUEsQ0FBQSxJQUFBLGlDQUFBLENBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxnQ0FBQSxDQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsK0JBQUEsQ0FBQSxDQUFBLE9BQUEsVUFBQSxDQUFBLENBQ0EsV0FBQSxDQUFBLElBQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBRG9HRixDQUFBLEFDbEdBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLFlBQUEsQ0FDQSxHQUFBLENBQUEsSUFBQSw2QkFBQSxDQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsNEJBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLDJCQUFBLENBQUEsQ0FBQSxPQUFBLFVBQUEsQ0FBQSxDQUNBLFdBQUEsQ0FBQSxNQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQURvR0YsQ0FBQSxBQ2xHQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxpQkFBQSxDQUNBLEdBQUEsQ0FBQSxJQUFBLGdDQUFBLENBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSwrQkFBQSxDQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsOEJBQUEsQ0FBQSxDQUFBLE9BQUEsVUFBQSxDQUFBLENBQ0EsV0FBQSxDQUFBLElBQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBRG9HRixDQUFBLEFDbEdBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLGlCQUFBLENBQ0EsR0FBQSxDQUFBLElBQUEsa0NBQUEsQ0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLGlDQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxnQ0FBQSxDQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsQ0FDQSxXQUFBLENBQUEsTUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEb0dGLENBQUEsQUNsR0EsVUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsaUJBQUEsQ0FDQSxHQUFBLENBQUEsSUFBQSxtQ0FBQSxDQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsa0NBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLGlDQUFBLENBQUEsQ0FBQSxPQUFBLFVBQUEsQ0FBQSxDQUNBLFdBQUEsQ0FBQSxNQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQURvR0YsQ0FBQSxBQ2xHQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxjQUFBLENBQ0EsR0FBQSxDQUFBLElBQUEsZ0NBQUEsQ0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLCtCQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSw4QkFBQSxDQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsQ0FDQSxXQUFBLENBQUEsTUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEb0dGLENBQUEsQUNsR0EsVUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsYUFBQSxDQUNBLEdBQUEsQ0FBQSxJQUFBLCtCQUFBLENBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSw4QkFBQSxDQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsNkJBQUEsQ0FBQSxDQUFBLE9BQUEsVUFBQSxDQUFBLENBQ0EsV0FBQSxDQUFBLE1BQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBRG9HRixDQUFBLEFDbEdBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLGFBQUEsQ0FDQSxHQUFBLENBQUEsSUFBQSwrQkFBQSxDQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsOEJBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLDZCQUFBLENBQUEsQ0FBQSxPQUFBLFVBQUEsQ0FBQSxDQUNBLFdBQUEsQ0FBQSxNQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQURvR0YsQ0FBQSxBQ2xHQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxhQUFBLENBQ0EsR0FBQSxDQUFBLElBQUEsK0JBQUEsQ0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLDhCQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSw2QkFBQSxDQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsQ0FDQSxXQUFBLENBQUEsTUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEb0dGLENBQUEsQUNsR0EsVUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsYUFBQSxDQUNBLEdBQUEsQ0FBQSxJQUFBLCtCQUFBLENBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSw4QkFBQSxDQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsNkJBQUEsQ0FBQSxDQUFBLE9BQUEsVUFBQSxDQUFBLENBQ0EsV0FBQSxDQUFBLE1BQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBRG9HRixDQUFBLEFDbEdBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLGtCQUFBLENBQ0EsR0FBQSxDQUFBLElBQUEsb0NBQUEsQ0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLG1DQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxrQ0FBQSxDQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsQ0FDQSxXQUFBLENBQUEsTUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEb0dGLENBQUEsQUNsR0EsTUFBQSxBQUFBLENBQUEsQUFDRSxJQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLEtBQUEsQ0FDQSxXQUFBLENBQUEsR0FBQSxDQUNBLFdBQUEsQ0FBQSxDQUFBLENBQ0EsY0FBQSxDQUFBLElBQUEsQURvR0YsQ0FBQSxBQ2xHQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLENBQUEsQUFBQSxDQUFBLEFBQ0Usd0JBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxDQUNBLFlBQUEsQ0FBQSxZQUFBLEFEcUdGLENBQUEsQUNuR0EsTUFBQSxBQUFBLENBQUEsQUFBQSxxQkFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsU0FBQSxBRHNHRixDQUFBLEFDcEdBLE1BQUEsQUFBQSxDQUFBLEFBQUEsYUFBQSxBQUFBLENBQUEsQUFHRSxRQUFBLENBQUEsUUFBQSxDQUNBLElBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUNBLE9BQUEsQ0FBQSxDQUFBLENBQ0EsTUFBQSxDQUFBLENBQUEsQ0FDQSxNQUFBLENBQUEsR0FBQSxDQUNBLEtBQUEsQ0FBQSxHQUFBLENBQ0EsUUFBQSxDQUFBLE1BQUEsQUR1R0YsQ0FBQSxBQ3JHQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFdBQUEsQUFBQSxDQUFBLEFEeUdBLENBQUEsQUN0R0EsTUFBQSxBQUFBLENBQUEsQUFBQSxXQUFBLEFBQUEsQ0FBQSxRQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxLQUFBLEFEeUdGLENBQUEsQUN2R0EsTUFBQSxBQUFBLENBQUEsQUFBQSxLQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxRQUFBLENBQ0EsT0FBQSxDQUFBLFlBQUEsQ0FDQSxXQUFBLENBQUEsTUFBQSxDQUNBLEtBQUEsQ0FBQSxtQkFBQSxDQUNBLEtBQUEsQ0FBQSxnQkFBQSxDQUNBLEtBQUEsQ0FBQSxXQUFBLEFEMEdGLENBQUEsQUN4R0EsTUFBQSxBQUFBLENBQUEsQUFBQSxNQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxZQUFBLEFEMkdGLENBQUEsQUN6R0EsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxJQUFBLEFENEdGLENBQUEsQUMxR0EsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLFVBQUEsQ0FBQSxNQUFBLEFENkdGLENBQUEsQUMzR0EsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxVQUFBLEFEOEdGLENBQUEsQUM1R0EsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxlQUFBLEFEK0dGLENBQUEsQUM3R0EsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxnQkFBQSxBRGdIRixDQUFBLEFDOUdBLE1BQUEsQUFBQSxDQUFBLEFBQUEsV0FBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsVUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEaUhGLENBQUEsQUMvR0EsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxVQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQURrSEYsQ0FBQSxBQ2hIQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE9BQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLE1BQUEsQURtSEYsQ0FBQSxBQ2pIQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE9BQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLFVBQUEsQ0FDQSxXQUFBLENBQUEsSUFBQSxBRG9IRixDQUFBLEFDbEhBLE1BQUEsQUFBQSxDQUFBLEFBQUEsV0FBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsVUFBQSxDQUNBLFdBQUEsQ0FBQSxJQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQURxSEYsQ0FBQSxBQ25IQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE1BQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLFNBQUEsQURzSEYsQ0FBQSxBQ3BIQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE9BQUEsQUFBQSxnQkFFRSxXQUFBLENBQUEsU0FBQSxBRHVIRixDQUFBLEFDckhBLE1BQUEsQUFBQSxDQUFBLEFBQUEsUUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsaUJBQUEsQUR3SEYsQ0FBQSxBQ3RIQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFNBQUEsQUFBQSxrQkFFRSxXQUFBLENBQUEsYUFBQSxBRHlIRixDQUFBLEFDdkhBLE1BQUEsQUFBQSxDQUFBLEFBQUEsT0FBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsZ0JBQUEsQUQwSEYsQ0FBQSxBQ3hIQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFFBQUEsQUFBQSxpQkFFRSxXQUFBLENBQUEsWUFBQSxBRDJIRixDQUFBLEFDekhBLE1BQUEsQUFBQSxDQUFBLEFBQUEsT0FBQSxBQUFBLGdCQUVFLFdBQUEsQ0FBQSxlQUFBLEFENEhGLENBQUEsQUMxSEEsTUFBQSxBQUFBLENBQUEsQUFBQSxXQUFBLEFBQUEsb0JBRUUsV0FBQSxDQUFBLGVBQUEsQ0FDQSxXQUFBLENBQUEsSUFBQSxBRDZIRixDQUFBLEFDM0hBLE1BQUEsQUFBQSxDQUFBLEFBQUEsU0FBQSxBQUFBLGtCQUVFLFdBQUEsQ0FBQSxlQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQUQ4SEYsQ0FBQSxBQzVIQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE9BQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLFVBQUEsQ0FDQSxVQUFBLENBQUEsTUFBQSxBRCtIRixDQUFBLEFDN0hBLE1BQUEsQUFBQSxDQUFBLEFBQUEsUUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsWUFBQSxDQUNBLFlBQUEsQ0FBQSxLQUFBLENBQ0EsZUFBQSxDQUFBLFFBQUEsQURnSUYsQ0FBQSxBQzlIQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFFBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLFNBQUEsQURpSUYsQ0FBQSxBQy9IQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE1BQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLFVBQUEsQ0FDQSxjQUFBLENBQUEsTUFBQSxDQUNBLFFBQUEsQ0FBQSxRQUFBLEFEa0lGLENBQUEsQUNoSUEsTUFBQSxBQUFBLENBQUEsQUFBQSxNQUFBLEFBQUEsQ0FBQSxJQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxLQUFBLENBQ0EsTUFBQSxDQUFBLENBQUEsQ0FDQSxRQUFBLENBQUEsUUFBQSxBRG1JRixDQUFBLEFDaklBLE1BQUEsQUFBQSxDQUFBLEFBQUEsTUFBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsWUFBQSxBRG9JRixDQUFBLEFDbElBLE1BQUEsQUFBQSxDQUFBLEFBQUEsTUFBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsT0FBQSxBQUFBLENBQUEsQUFDRSxRQUFBLENBQUEsTUFBQSxDQUNBLEtBQUEsQ0FBQSxDQUFBLEFEcUlGLENBQUEsQUNuSUEsTUFBQSxBQUFBLENBQUEsQUFBQSxTQUFBLEFBQUEsQ0FBQSxBQUNFLFlBQUEsQ0FBQSxJQUFBLEFEc0lGLENBQUEsQUNwSUEsTUFBQSxBQUFBLENBQUEsQUFBQSxRQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxVQUFBLENBQ0EsY0FBQSxDQUFBLE1BQUEsQ0FDQSxTQUFBLENBQUEsR0FBQSxDQUNBLEtBQUEsQ0FBQSxHQUFBLENBQ0EsU0FBQSxDQUFBLEdBQUEsQUR1SUYsQ0FBQSxBQ3JJQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLEtBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLGtCQUFBLENBQ0EsT0FBQSxDQUFBLFdBQUEsQ0FDQSxrQkFBQSxDQUFBLFFBQUEsQ0FDQSxxQkFBQSxDQUFBLE1BQUEsQ0FDUSxjQUFBLENBQUEsTUFBQSxDQUNSLGlCQUFBLENBQUEsUUFBQSxDQUNRLFdBQUEsQ0FBQSxRQUFBLEFEd0lWLENBQUEsQUN0SUEsTUFBQSxBQUFBLENBQUEsQUFBQSxLQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxrQkFBQSxDQUNBLE9BQUEsQ0FBQSxXQUFBLENBQ0Esa0JBQUEsQ0FBQSxVQUFBLENBQ0EscUJBQUEsQ0FBQSxNQUFBLENBQ1EsY0FBQSxDQUFBLEdBQUEsQ0FDUixLQUFBLENBQUEsSUFBQSxBRHlJRixDQUFBLEFDdklBLE1BQUEsQUFBQSxDQUFBLEFBQUEsUUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsa0JBQUEsQ0FDQSxPQUFBLENBQUEsV0FBQSxDQUNBLGtCQUFBLENBQUEsVUFBQSxDQUNBLHFCQUFBLENBQUEsTUFBQSxDQUNRLGNBQUEsQ0FBQSxHQUFBLENBQ1IsS0FBQSxDQUFBLENBQUEsQ0FDQSxTQUFBLENBQUEsQ0FBQSxBRDBJRixDQUFBLEFDeElBLE1BQUEsQUFBQSxDQUFBLEFBQUEsUUFBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsSUFBQSxBRDJJRixDQUFBLEFDeklBLE1BQUEsQUFBQSxDQUFBLEFBQUEsTUFBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsTUFBQSxBRDRJRixDQUFBLEFDMUlBLE1BQUEsQUFBQSxDQUFBLEFBQUEsTUFBQSxBQUFBLENBQUEsQUFBQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxZQUFBLENBQ0EsS0FBQSxDQUFBLElBQUEsQ0FDQSxtQkFBQSxDQUFBLEtBQUEsQUQ2SUYsQ0FBQSxBQzNJQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE1BQUEsQUFBQSxDQUFBLEFBQUEsVUFBQSxBQUFBLGdIQU1FLFVBQUEsQ0FBQSxHQUFBLEFEOElGLENBQUEsQUM1SUEsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxZQUFBLEFEK0lGLENBQUEsQUM3SUEsTUFBQSxBQUFBLENBQUEsQUFBQSxLQUFBLEFBQUEsMkJBR0UsS0FBQSxDQUFBLENBQUEsQ0FDQSxRQUFBLENBQUEsUUFBQSxBRGdKRixDQUFBLEFDOUlBLE1BQUEsQUFBQSxDQUFBLEFBQUEsS0FBQSxBQUFBLENBQUEsTUFBQSxBQUFBLHlDQUdFLFFBQUEsQ0FBQSxRQUFBLEFEaUpGLENBQUEsQUMvSUEsTUFBQSxBQUFBLENBQUEsQUFBQSxLQUFBLEFBQUEsQ0FBQSxJQUFBLEFBQUEscUNBR0UsT0FBQSxDQUFBLFlBQUEsQURrSkYsQ0FBQSxBQ2hKQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLEtBQUEsQUFBQSxDQUFBLE1BQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLENBQUEsQURtSkYsQ0FBQSxBQ2pKQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLEtBQUEsQUFBQSxDQUFBLE1BQUEsQUFBQSxxQkFFRSxJQUFBLENBQUEsQ0FBQSxBRG9KRixDQUFBLEFDbEpBLE1BQUEsQUFBQSxDQUFBLEFBQUEsS0FBQSxBQUFBLENBQUEsTUFBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsSUFBQSxDQUNBLFlBQUEsQ0FBQSxHQUFBLEFEcUpGLENBQUEsQUNuSkEsTUFBQSxBQUFBLENBQUEsQUFBQSxLQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxZQUFBLENBQ0EsTUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQ0EsUUFBQSxDQUFBLFFBQUEsQURzSkYsQ0FBQSxBQ3BKQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFNBQUEsQUFBQSxDQUFBLEFBQUEsY0FBQSxBQUFBLGlEQUdFLE9BQUEsQ0FBQSxZQUFBLENBQ0EsS0FBQSxDQUFBLElBQUEsQ0FDQSxtQkFBQSxDQUFBLEtBQUEsQUR1SkYsQ0FBQSxBQ3JKQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLFlBQUEsQ0FDQSxLQUFBLENBQUEsSUFBQSxDQUNBLG1CQUFBLENBQUEsTUFBQSxBRHdKRixDQUFBLEFDdEpBLE1BQUEsQUFBQSxDQUFBLEFBQUEsS0FBQSxBQUFBLENBQUEsS0FBQSxBQUFBLENBQUEsQUFHRSxXQUFBLENBQUEsWUFBQSxDQUNBLFlBQUEsQ0FBQSxhQUFBLEFEeUpGLENBQUEsQUN2SkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEMEpGLENBQUEsQUN4SkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEMkpGLENBQUEsQUN6SkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFENEpGLENBQUEsQUMxSkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFENkpGLENBQUEsQUMzSkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEOEpGLENBQUEsQUM1SkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEK0pGLENBQUEsQUM3SkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEZ0tGLENBQUEsQUM5SkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFEaUtGLENBQUEsQUMvSkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEa0tGLENBQUEsQUNoS0EsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEbUtGLENBQUEsQUNqS0EsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEb0tGLENBQUEsQUNsS0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEcUtGLENBQUEsQUNuS0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEc0tGLENBQUEsQUNwS0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEdUtGLENBQUEsQUNyS0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEd0tGLENBQUEsQUN0S0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEeUtGLENBQUEsQUN2S0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEMEtGLENBQUEsQUN4S0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEMktGLENBQUEsQUN6S0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFENEtGLENBQUEsQUMxS0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFENktGLENBQUEsQUMzS0EsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEOEtGLENBQUEsQUM1S0EsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEK0tGLENBQUEsQUM3S0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEZ0xGLENBQUEsQUM5S0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEaUxGLENBQUEsQUMvS0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEa0xGLENBQUEsQUNoTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEbUxGLENBQUEsQUNqTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEb0xGLENBQUEsQUNsTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEcUxGLENBQUEsQUNuTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEc0xGLENBQUEsQUNwTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEdUxGLENBQUEsQUNyTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEd0xGLENBQUEsQUN0TEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEeUxGLENBQUEsQUN2TEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEMExGLENBQUEsQUN4TEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEMkxGLENBQUEsQUN6TEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFENExGLENBQUEsQUMxTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxPQUFBLEFENkxGLENBQUEsQUMzTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEOExGLENBQUEsQUM1TEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEK0xGLENBQUEsQUM3TEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFEZ01GLENBQUEsQUM5TEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEaU1GLENBQUEsQUMvTEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEa01GLENBQUEsQUNoTUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFEbU1GLENBQUEsQUNqTUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxRQUFBLEFEb01GLENBQUEsQUNsTUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxNQUFBLEFEcU1GLENBQUEsQUNuTUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEc01GLENBQUEsQUNwTUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEdU1GLENBQUEsQUNyTUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEd01GLENBQUEsQUN0TUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEeU1GLENBQUEsQUN2TUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEME1GLENBQUEsQUN4TUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEMk1GLENBQUEsQUN6TUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFENE1GLENBQUEsQUMxTUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFENk1GLENBQUEsQUMzTUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFEOE1GLENBQUEsQUM1TUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEK01GLENBQUEsQUM3TUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEZ05GLENBQUEsQUM5TUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEaU5GLENBQUEsQUMvTUEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEa05GLENBQUEsQUNoTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEbU5GLENBQUEsQUNqTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEb05GLENBQUEsQUNsTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEcU5GLENBQUEsQUNuTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEc05GLENBQUEsQUNwTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEdU5GLENBQUEsQUNyTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFEd05GLENBQUEsQUN0TkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEeU5GLENBQUEsQUN2TkEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEME5GLENBQUEsQUN4TkEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEMk5GLENBQUEsQUN6TkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFENE5GLENBQUEsQUMxTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFENk5GLENBQUEsQUMzTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEOE5GLENBQUEsQUM1TkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEK05GLENBQUEsQUM3TkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFEZ09GLENBQUEsQUM5TkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEaU9GLENBQUEsQUMvTkEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEa09GLENBQUEsQUNoT0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEbU9GLENBQUEsQUNqT0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxNQUFBLEFEb09GLENBQUEsQUNsT0EsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEcU9GLENBQUEsQUNuT0EsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEc09GLENBQUEsQUNwT0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEdU9GLENBQUEsQUNyT0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEd09GLENBQUEsQUN0T0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEeU9GLENBQUEsQUN2T0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEME9GLENBQUEsQUN4T0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxPQUFBLEFEMk9GLENBQUEsQUN6T0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFENE9GLENBQUEsQUMxT0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFENk9GLENBQUEsQUMzT0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEOE9GLENBQUEsQUM1T0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxLQUFBLEFEK09GLENBQUEsQUM3T0EsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEZ1BGLENBQUEsQUM5T0EsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEaVBGLENBQUEsQUMvT0EsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEa1BGLENBQUEsQUNoUEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEbVBGLENBQUEsQUNqUEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEb1BGLENBQUEsQUNsUEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEcVBGLENBQUEsQUNuUEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEc1BGLENBQUEsQUNwUEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxXQUFBLEFEdVBGLENBQUEsQUNyUEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEd1BGLENBQUEsQUN0UEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEeVBGLENBQUEsQUN2UEEsTUFBQSxBQUFBLENBQUEsQUFBQSx5QkFBQSxBQUFBLDRDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEMFBGLENBQUEsQUN4UEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEMlBGLENBQUEsQUN6UEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFENFBGLENBQUEsQUMxUEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFENlBGLENBQUEsQUMzUEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEOFBGLENBQUEsQUM1UEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEK1BGLENBQUEsQUM3UEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEZ1FGLENBQUEsQUM5UEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEaVFGLENBQUEsQUMvUEEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEa1FGLENBQUEsQUNoUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEbVFGLENBQUEsQUNqUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEb1FGLENBQUEsQUNsUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEcVFGLENBQUEsQUNuUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwyQkFBQSxBQUFBLDhDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEc1FGLENBQUEsQUNwUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwyQkFBQSxBQUFBLDhDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEdVFGLENBQUEsQUNyUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEd1FGLENBQUEsQUN0UUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEeVFGLENBQUEsQUN2UUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEMFFGLENBQUEsQUN4UUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEMlFGLENBQUEsQUN6UUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFENFFGLENBQUEsQUMxUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFENlFGLENBQUEsQUMzUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEOFFGLENBQUEsQUM1UUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEK1FGLENBQUEsQUM3UUEsTUFBQSxBQUFBLENBQUEsQUFBQSwwQkFBQSxBQUFBLDZDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEZ1JGLENBQUEsQUM5UUEsTUFBQSxBQUFBLENBQUEsQUFBQSwyQkFBQSxBQUFBLDhDQUVFLFNBQUEsQ0FBQSxZQUFBLEFEaVJGLENBQUEsQUMvUUEsTUFBQSxBQUFBLENBQUEsQUFBQSwyQkFBQSxBQUFBLDhDQUVFLFNBQUEsQ0FBQSxHQUFBLEFEa1JGLENBQUEsQUNoUkEsTUFBQSxBQUFBLENBQUEsQUFBQSxrQkFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsV0FBQSxBRG1SRixDQUFBLEFDalJBLE1BQUEsQUFBQSxDQUFBLEFBQUEsa0JBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLFdBQUEsQURvUkYsQ0FBQSxBQ2xSQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLGtCQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxXQUFBLEFEcVJGLENBQUEsQUNuUkEsTUFBQSxBQUFBLENBQUEsQUFBQSxrQkFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsV0FBQSxBRHNSRixDQUFBLEFDcFJBLE1BQUEsQUFBQSxDQUFBLEFBQUEsaUJBQUEsQUFBQSxDQUFBLEFBQUEsWUFBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsV0FBQSxBRHVSRixDQUFBLEFDclJBLE1BQUEsQUFBQSxDQUFBLEFBQUEsaUJBQUEsQUFBQSxDQUFBLEFBQUEsWUFBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsV0FBQSxBRHdSRixDQUFBLEFDdFJBLE1BQUEsQUFBQSxDQUFBLEFBQUEsY0FBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsWUFBQSxDQUNBLEtBQUEsQ0FBQSxNQUFBLEFEeVJGLENBQUEsQUN2UkEsTUFBQSxBQUFBLENBQUEsQUFBQSxZQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxRQUFBLEFEMFJGLENBQUEsQUN4UkEsTUFBQSxBQUFBLENBQUEsQUFBQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxRQUFBLEFEMlJGLENBQUEsQUN6UkEsTUFBQSxBQUFBLENBQUEsQUFBQSxtQkFBQSxBQUFBLENBQUEsQUFDRSxXQUFBLENBQUEsV0FBQSxBRDRSRixDQUFBLEFDMVJBLE1BQUEsQUFBQSxDQUFBLEFBQUEsbUJBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLFdBQUEsQUQ2UkYsQ0FBQSxBQzNSQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFVBQUEsQUFBQSxDQUFBLFFBQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLE1BQUEsQUQ4UkYsQ0FBQSxBQzVSQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE9BQUEsQUFBQSxDQUFBLFFBQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLE1BQUEsQUQrUkYsQ0FBQSxBQzdSQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE9BQUEsQUFBQSxDQUFBLEFBQUEsWUFBQSxBQUFBLENBQUEsQUFDRSxRQUFBLENBQUEsUUFBQSxBRGdTRixDQUFBLEFDOVJBLE1BQUEsQUFBQSxDQUFBLEFBQUEsT0FBQSxBQUFBLENBQUEsQUFBQSw4QkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsQ0FBQSxBRGlTRixDQUFBLEFDL1JBLE1BQUEsQUFBQSxDQUFBLEFBQUEsUUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsS0FBQSxBRGtTRixDQUFBLEFDaFNBLE1BQUEsQUFBQSxDQUFBLEFBQUEsT0FBQSxBQUFBLENBQUEsQUFBQSxtQkFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsWUFBQSxDQUNBLFNBQUEsQ0FBQSxHQUFBLEFEbVNGLENBQUEsQUNqU0EsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUFBLFlBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLFlBQUEsQURvU0YsQ0FBQSxBQ2xTQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLE9BQUEsQUFBQSxDQUFBLEFBQUEsWUFBQSxBQUFBLENBQUEsUUFBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsTUFBQSxBRHFTRixDQUFBLEFDblNBLE1BQUEsQUFBQSxDQUFBLEFBQUEsT0FBQSxBQUFBLENBQUEsQUFBQSxZQUFBLEFBQUEsQ0FBQSxRQUFBLEFBQUEsQ0FBQSxBQUNFLFVBQUEsQ0FBQSxJQUFBLEFEc1NGLENBQUEsQUNwU0EsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUFBLFlBQUEsQUFBQSxDQUFBLFFBQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLEtBQUEsQUR1U0YsQ0FBQSxBQ3JTQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFVBQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLElBQUEsQUR3U0YsQ0FBQSxBQ3RTQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLEdBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLEtBQUEsQ0FDQSxRQUFBLENBQUEsUUFBQSxDQUNBLEtBQUEsQ0FBQSxJQUFBLENBQ0EsTUFBQSxDQUFBLE9BQUEsQ0FDQSxJQUFBLENBQUEsWUFBQSxDQUNBLE1BQUEsQ0FBQSxZQUFBLENBQ0EsU0FBQSxDQUFBLE9BQUEsQ0FDQSxZQUFBLENBQUEsQ0FBQSxDQUNBLFlBQUEsQ0FBQSxDQUFBLENBQ0EsY0FBQSxDQUFBLElBQUEsQ0FDQSxlQUFBLENBQUEsS0FBQSxDQUNBLGlCQUFBLENBQUEsQ0FBQSxDQUNBLGdCQUFBLENBQUEsSUFBQSxDQUNBLGlCQUFBLENBQUEsQ0FBQSxDQUNBLGNBQUEsQ0FBQSxDQUFBLEFEeVNGLENBQUEsQUN2U0EsTUFBQSxBQUFBLENBQUEsQUFBQSxHQUFBLEFBQUEsQ0FBQSxBQUFBLElBQUEsQUFBQSxDQUFBLEFBQ0UsTUFBQSxDQUFBLElBQUEsQUQwU0YsQ0FBQSxBQ3hTQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLEdBQUEsQUFBQSxDQUFBLEFBQ0UsWUFBQSxDQUFBLElBQUEsQ0FDQSxTQUFBLENBQUEsQ0FBQSxDQUNBLFVBQUEsQ0FBQSxDQUFBLENBQ0EsU0FBQSxDQUFBLElBQUEsQ0FDQSxVQUFBLENBQUEsSUFBQSxBRDJTRixDQUFBLEFDelNBLE1BQUEsQUFBQSxDQUFBLEFBQUEsU0FBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsSUFBQSxDQUNBLE9BQUEsQ0FBQSxLQUFBLENBQ0EsUUFBQSxDQUFBLFFBQUEsQ0FDQSxRQUFBLENBQUEsTUFBQSxBRDRTRixDQUFBLEFDMVNBLE1BQUEsQUFBQSxDQUFBLEFBQUEsaUJBQUEsQUFBQSx5QkFFRSxPQUFBLENBQUEsRUFBQSxBRDZTRixDQUFBLEFDM1NBLE1BQUEsQUFBQSxDQUFBLEFBQUEsVUFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsSUFBQSxDQUNBLFFBQUEsQ0FBQSxRQUFBLENBQ0EsUUFBQSxDQUFBLE1BQUEsQUQ4U0YsQ0FBQSxBQzVTQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLGVBQUEsQUFBQSxDQUFBLEFBQ0UsUUFBQSxDQUFBLFFBQUEsQ0FDQSxJQUFBLENBQUEsQ0FBQSxDQUNBLEtBQUEsQ0FBQSxLQUFBLENBQ0EsUUFBQSxDQUFBLE1BQUEsQUQrU0YsQ0FBQSxBQzdTQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLGdCQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxRQUFBLENBQ0EsS0FBQSxDQUFBLENBQUEsQ0FDQSxLQUFBLENBQUEsS0FBQSxDQUNBLFFBQUEsQ0FBQSxNQUFBLEFEZ1RGLENBQUEsQUM5U0EsTUFBQSxBQUFBLENBQUEsQUFBQSxXQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxRQUFBLENBQ0EsSUFBQSxDQUFBLENBQUEsQ0FDQSxLQUFBLENBQUEsS0FBQSxDQUNBLFFBQUEsQ0FBQSxNQUFBLEFEaVRGLENBQUEsQUMvU0EsTUFBQSxBQUFBLENBQUEsQUFBQSxhQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxRQUFBLENBQ0EsSUFBQSxDQUFBLEdBQUEsQ0FDQSxLQUFBLENBQUEsR0FBQSxDQUNBLFFBQUEsQ0FBQSxNQUFBLEFEa1RGLENBQUEsQUNoVEEsTUFBQSxBQUFBLENBQUEsQUFBQSxZQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxRQUFBLENBQ0EsS0FBQSxDQUFBLENBQUEsQ0FDQSxLQUFBLENBQUEsS0FBQSxDQUNBLFFBQUEsQ0FBQSxNQUFBLEFEbVRGLENBQUEsQUNqVEEsTUFBQSxBQUFBLENBQUEsQUFBQSxZQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxBRG9URixDQUFBLEFDbFRBLE1BQUEsQUFBQSxDQUFBLEFBQUEsYUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxBRHFURixDQUFBLEFDblRBLE1BQUEsQUFBQSxDQUFBLEFBQUEsUUFBQSxBQUFBLDhCQUdFLFVBQUEsQ0FBQSxNQUFBLEFEc1RGLENBQUEsQUNwVEEsTUFBQSxBQUFBLENBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEFEdVRGLENBQUEsQUNyVEEsTUFBQSxBQUFBLENBQUEsQUFBQSxLQUFBLEFBQUEsbUJBRUUsVUFBQSxDQUFBLFVBQUEsQ0FDQSxNQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsQUR3VEYsQ0FBQSxBQ3RUQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFdBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsQUR5VEYsQ0FBQSxBQ3ZUQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLFdBQUEsQUFBQSxDQUFBLEFBQ0UsV0FBQSxDQUFBLE1BQUEsQ0FDQSxZQUFBLENBQUEsTUFBQSxBRDBURixDQUFBLEFDeFRBLE1BQUEsQUFBQSxDQUFBLEFBQUEsS0FBQSxBQUFBLENBQUEsQUFDRSxtQkFBQSxDQUFBLEtBQUEsQ0FDQSxtQkFBQSxDQUFBLE1BQUEsQUQyVEYsQ0FBQSxBQ3pUQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLEtBQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLGNBQUEsQ0FDQSxVQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsQ0FDQSxZQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsQ0FDQSxZQUFBLENBQUEsU0FBQSxBRDRURixDQUFBLEFDMVRBLE1BQUEsQUFBQSxDQUFBLEFBQUEsUUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxBRDZURixDQUFBLEFDM1RBLE1BQUEsQUFBQSxDQUFBLEFBQUEsZ0JBQUEsQUFBQSxDQUFBLEFBQ0UsaUJBQUEsQ0FBQSxVQUFBLENBQ0EsT0FBQSxDQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUEsQUQ4VEYsQ0FBQSxBQzVUQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLG9CQUFBLEFBQUEsQ0FBQSxBQUNFLGlCQUFBLENBQUEsUUFBQSxDQUNBLE9BQUEsQ0FBQSxHQUFBLENBQUEsUUFBQSxRQUFBLENBQUEsQ0FBQSxHQUFBLEFEK1RGLENBQUEsQUM3VEEsTUFBQSxBQUFBLENBQUEsQUFBQSxTQUFBLEFBQUEsQ0FBQSxBQUNFLEtBQUEsQ0FBQSxHQUFBLEFEZ1VGLENBQUEsQUM5VEEsTUFBQSxBQUFBLENBQUEsQUFBQSxjQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxZQUFBLENBQ0EsUUFBQSxDQUFBLFFBQUEsQURpVUYsQ0FBQSxBQy9UQSxNQUFBLEFBQUEsQ0FBQSxBQUFBLGNBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLFlBQUEsQ0FDQSxRQUFBLENBQUEsUUFBQSxDQUNBLEtBQUEsQ0FBQSxhQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLENBQ0EsS0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FDQSxVQUFBLENBQUEsSUFBQSxBRGtVRixDQUFBLEFDaFVBLE1BQUEsQUFBQSxDQUFBLEFBQUEsZUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsWUFBQSxDQUNBLFFBQUEsQ0FBQSxRQUFBLENBQ0EsSUFBQSxDQUFBLGFBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUNBLFVBQUEsQ0FBQSxLQUFBLEFEbVVGLENBQUEsQUNqVUEsY0FBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsS0FBQSxDQUNBLE1BQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFEb1VGLENBQUEsQUNsVUEsY0FBQSxBQUFBLENBQUEsTUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsS0FBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLENBQ0EsV0FBQSxDQUFBLE1BQUEsQURxVUYsQ0FBQSxBQ25VQSxjQUFBLEFBQUEsQ0FBQSxNQUFBLEFBQUEsQ0FBQSxXQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxLQUFBLENBQ0EsUUFBQSxDQUFBLFFBQUEsQURzVUYsQ0FBQSxBQ3BVQSxjQUFBLEFBQUEsQ0FBQSxNQUFBLEFBQUEsQ0FBQSxXQUFBLEFBQUEsQ0FBQSxJQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxRQUFBLENBQ0EsS0FBQSxDQUFBLENBQUEsQUR1VUYsQ0FBQSxBQ3JVQSxvQkFBQSxBQUFBLENBQUEsTUFBQSxBQUFBLENBQUEsV0FBQSxBQUFBLENBQUEsSUFBQSxBQUFBLENBQUEsQUFDRSxJQUFBLENBQUEsQ0FBQSxDQUNBLEtBQUEsQ0FBQSxJQUFBLEFEd1VGLENBQUEsQUN0VUEsb0JBQUEsQUFBQSxDQUFBLE1BQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLElBQUEsQ0FDQSxZQUFBLENBQUEsR0FBQSxBRHlVRixDQUFBLEFDdlVBLElBQUEsQUFBQSxDQUFBLEFBQ0UsYUFBQSxDQUFBLFVBQUEsQ0FBQSxRQUFBLEFEMFVGLENBQUEsQUUxNENBLDZCQUFBLEFBQUEsQ0FBQSxBQUNFLFFBQUEsQ0FBQSxPQUFBLEFGNjRDRixDQUFBLEFFMzRDQSxlQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxZQUFBLENBQ0EsU0FBQSxDQUFBLE9BQUEsQ0FDQSxNQUFBLENBQUEsR0FBQSxDQUNBLFFBQUEsQ0FBQSxPQUFBLENBQ0EsY0FBQSxDQUFBLFFBQUEsQUY4NENGLENBQUEsQUU3NENFLHFCQUFBLEFBQUEsQ0FBQSxBQUNFLGNBQUEsQ0FBQSxRQUFBLEFGZzVDSixDQUFBLEFFLzRDRSxzQkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsUUFBQSxBRms1Q0osQ0FBQSxBRWo1Q0Usc0JBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLE9BQUEsQUZvNUNKLENBQUEsQUVuNUNFLHNCQUFBLEFBQUEsQ0FBQSxBQUNFLEtBQUEsQ0FBQSxRQUFBLEFGczVDSixDQUFBLEFFcjVDRSxzQkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsTUFBQSxBRnc1Q0osQ0FBQSxBRXY1Q0Usc0JBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLFFBQUEsQUYwNUNKLENBQUEsQUV6NUNFLHNCQUFBLEFBQUEsQ0FBQSxBQUNFLEtBQUEsQ0FBQSxPQUFBLEFGNDVDSixDQUFBLEFFMzVDRSxzQkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsUUFBQSxBRjg1Q0osQ0FBQSxBRTc1Q0Usc0JBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLEtBQUEsQUZnNkNKLENBQUEsQUUvNUNFLHNCQUFBLEFBQUEsQ0FBQSxBQUNFLEtBQUEsQ0FBQSxRQUFBLEFGazZDSixDQUFBLEFFajZDRSx1QkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsT0FBQSxBRm82Q0osQ0FBQSxBRW42Q0UsdUJBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLFFBQUEsQUZzNkNKLENBQUEsQUVyNkNFLHVCQUFBLEFBQUEsQ0FBQSxBQUNFLEtBQUEsQ0FBQSxNQUFBLEFGdzZDSixDQUFBLEFFdjZDRSx1QkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsUUFBQSxBRjA2Q0osQ0FBQSxBRXo2Q0UsdUJBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLE9BQUEsQUY0NkNKLENBQUEsQUUzNkNFLHVCQUFBLEFBQUEsQ0FBQSxBQUNFLEtBQUEsQ0FBQSxRQUFBLEFGODZDSixDQUFBLEFFNzZDRSx1QkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsR0FBQSxBRmc3Q0osQ0FBQSxBRS82Q0UsdUJBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLFFBQUEsQUZrN0NKLENBQUEsQUVqN0NFLHVCQUFBLEFBQUEsQ0FBQSxBQUNFLEtBQUEsQ0FBQSxPQUFBLEFGbzdDSixDQUFBLEFFbjdDRSx1QkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsUUFBQSxBRnM3Q0osQ0FBQSxBRXI3Q0UsdUJBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLE1BQUEsQUZ3N0NKLENBQUEsQUV2N0NFLDRCQUFBLEFBQUEsQ0FBQSxBQUNFLFlBQUEsQ0FBQSxLQUFBLENBQ0EsS0FBQSxDQUFBLElBQUEsQUYwN0NKLENBQUEsQUV6N0NFLDZCQUFBLEFBQUEsQ0FBQSxBQUNFLFdBQUEsQ0FBQSxLQUFBLENBQ0EsS0FBQSxDQUFBLElBQUEsQUY0N0NKLENBQUEsQUUzN0NFLHlCQUFBLEFBQUEsQ0FBQSxBQUNFLE1BQUEsQ0FBQSxLQUFBLEFGODdDSixDQUFBLEFFNzdDRSxxQkFBQSxBQUFBLENBQUEsQUFDRSxLQUFBLENBQUEsR0FBQSxBRmc4Q0osQ0FBQSxBRS83Q0UscUJBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLE1BQUEsQUZrOENKLENBQUEsQUVoOENBLFVBQUEsQUFBQSxDQUFBLEFBQUEsa0JBQUEsQUFBQSxDQUFBLEFBQ0UsTUFBQSxDQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsQ0FBQSxDQUNBLE1BQUEsQ0FBQSxJQUFBLENBQ0EsUUFBQSxDQUFBLFFBQUEsQ0FDQSxLQUFBLENBQUEsQ0FBQSxDQUNBLEdBQUEsQ0FBQSxDQUFBLEFGbThDRixDQUFBLEFFajhDQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxZQUFBLENBQ0EsTUFBQSxDQUFBLEdBQUEsQ0FDQSxRQUFBLENBQUEsUUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLENBQ0EsY0FBQSxDQUFBLFFBQUEsQ0FDQSxLQUFBLENBQUEsR0FBQSxBRm84Q0YsQ0FBQSxBRW44Q0UsVUFBQSxBQUFBLENBQUEsQUFBQSxrQkFBQSxBQUFBLENBQUEsQUFDRSx3QkFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLENBQ1EsZ0JBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxBRnM4Q1osQ0FBQSxBRXA4Q0EsZUFBQSxBQUFBLENBQUEsa0JBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLFlBQUEsQ0FDQSxRQUFBLENBQUEsUUFBQSxDQUNBLFVBQUEsQ0FBQSxNQUFBLEFGdThDRixDQUFBLEFFcjhDQSxlQUFBLEFBQUEsQ0FBQSxBQUNFLElBQUEsQ0FBQSxHQUFBLENBQ0EsR0FBQSxDQUFBLEdBQUEsQ0FDQSxpQkFBQSxDQUFBLFVBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQ1EsU0FBQSxDQUFBLFVBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQ1Isd0JBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUNRLGdCQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQUZ3OENWLENBQUEsQUV0OENBLGtCQUFBLEFBQUEsQ0FBQSxBQUNFLGdCQUFBLENBQUEsT0FBQSxDQUNBLGFBQUEsQ0FBQSxHQUFBLENBQ0Esa0JBQUEsQ0FBQSxVQUFBLENBQ1EsVUFBQSxDQUFBLFVBQUEsQ0FDUixLQUFBLENBQUEsSUFBQSxDQUNBLE1BQUEsQ0FBQSxLQUFBLENBQ0EsV0FBQSxDQUFBLENBQUEsQ0FDQSxTQUFBLENBQUEsR0FBQSxDQUNBLFNBQUEsQ0FBQSxLQUFBLENBQ0EsUUFBQSxDQUFBLE1BQUEsQ0FDQSxPQUFBLENBQUEsTUFBQSxDQUNBLEtBQUEsQ0FBQSxDQUFBLENBQ0EsYUFBQSxDQUFBLFFBQUEsQ0FDQSxHQUFBLENBQUEsQ0FBQSxDQUNBLGlCQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsQ0FDUSxTQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsQ0FDUix3QkFBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQ1EsZ0JBQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxBRnk4Q1YsQ0FBQSxBRXY4Q0EsdUJBQUEsQUFBQSxDQUFBLEFBQ0UsTUFBQSxDQUFBLENBQUEsQ0FDQSxLQUFBLENBQUEsQ0FBQSxDQUNBLEdBQUEsQ0FBQSxJQUFBLENBQ0EsaUJBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUNRLFNBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUNSLHdCQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsQ0FDUSxnQkFBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLEFGMDhDVixDQUFBLEFFeDhDQSxzQkFBQSxBQUFBLENBQUEsQUFDRSxNQUFBLENBQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxDQUFBLENBQ0EsS0FBQSxDQUFBLElBQUEsQ0FDQSxHQUFBLENBQUEsSUFBQSxDQUNBLGlCQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsQ0FDUSxTQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsQ0FDUix3QkFBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLENBQ1EsZ0JBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxBRjI4Q1YsQ0FBQSxBRXo4Q0Esb0JBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLENBQUEsQ0FDQSxHQUFBLENBQUEsQ0FBQSxDQUNBLGlCQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsQ0FDUSxTQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsQ0FDUix3QkFBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQ1EsZ0JBQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxBRjQ4Q1YsQ0FBQSxBRTE4Q0EsbUJBQUEsQUFBQSxDQUFBLEFBQ0UsSUFBQSxDQUFBLENBQUEsQ0FDQSxLQUFBLENBQUEsSUFBQSxDQUNBLEdBQUEsQ0FBQSxDQUFBLENBQ0EsaUJBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUNRLFNBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUNSLHdCQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FDUSxnQkFBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLEFGNjhDVixDQUFBLEFFMzhDQSxNQUFBLEFBQUEsQ0FBQSxBQUNFLFNBQUEsQ0FBQSxTQUFBLENBQ0EsV0FBQSxDQUFBLE1BQUEsQ0FDQSxjQUFBLENBQUEsU0FBQSxBRjg4Q0YsQ0FBQSxBRTU4Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsTUFBQSxBRis4Q0YsQ0FBQSxBRTc4Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsT0FBQSxBRmc5Q0YsQ0FBQSxBRTk4Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRmk5Q0YsQ0FBQSxBRS84Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRms5Q0YsQ0FBQSxBRWg5Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRm05Q0YsQ0FBQSxBRWo5Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRm85Q0YsQ0FBQSxBRWw5Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRnE5Q0YsQ0FBQSxBRW45Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRnM5Q0YsQ0FBQSxBRXA5Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRnU5Q0YsQ0FBQSxBRXI5Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRnc5Q0YsQ0FBQSxBRXQ5Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsR0FBQSxBRnk5Q0YsQ0FBQSxBRXY5Q0EsT0FBQSxBQUFBLENBQUEsQUFDRSxTQUFBLENBQUEsSUFBQSxBRjA5Q0YsQ0FBQSxBRXg5Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsTUFBQSxDQUNBLEtBQUEsQ0FBQSxNQUFBLEFGMjlDRixDQUFBLEFFejlDQSxNQUFBLEFBQUEsQ0FBQSxBQUNFLGVBQUEsQ0FBQSxJQUFBLENBQ0EsV0FBQSxDQUFBLEtBQUEsQ0FDQSxZQUFBLENBQUEsQ0FBQSxBRjQ5Q0YsQ0FBQSxBRTM5Q0UsTUFBQSxBQUFBLENBQUEsRUFBQSxBQUFBLENBQUEsQUFDRSxRQUFBLENBQUEsUUFBQSxBRjg5Q0osQ0FBQSxBRTU5Q0EsTUFBQSxBQUFBLENBQUEsQUFDRSxJQUFBLENBQUEsSUFBQSxDQUNBLFFBQUEsQ0FBQSxRQUFBLENBQ0EsVUFBQSxDQUFBLE1BQUEsQ0FDQSxLQUFBLENBQUEsR0FBQSxDQUNBLFdBQUEsQ0FBQSxPQUFBLEFGKzlDRixDQUFBLEFFNzlDQSxVQUFBLEFBQUEsQ0FBQSxBQUNFLE1BQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FDQSxhQUFBLENBQUEsS0FBQSxDQUNBLE9BQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQUZnK0NGLENBQUEsQUU5OUNBLGFBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLElBQUEsQUZpK0NGLENBQUEsQUUvOUNBLGNBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLEtBQUEsQUZrK0NGLENBQUEsQUVoK0NBLGdCQUFBLEFBQUEseUVBS0UsWUFBQSxDQUFBLEtBQUEsQUZtK0NGLENBQUEsQUVqK0NBLGlCQUFBLEFBQUEsNkVBS0UsV0FBQSxDQUFBLEtBQUEsQUZvK0NGLENBQUEsQUVsK0NBLFFBQUEsQUFBQSxDQUFBLEFBQ0UsaUJBQUEsQ0FBQSxPQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLENBQ1EsU0FBQSxDQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsQUZxK0NWLENBQUEsQUVuK0NBLFNBQUEsQUFBQSxDQUFBLEFBQ0UsaUJBQUEsQ0FBQSxPQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxDQUNRLFNBQUEsQ0FBQSxPQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxBRnMrQ1YsQ0FBQSxBRXArQ0EsbUJBQUEsQUFBQSxPQUFBLEFBQUEsQ0FBQSxBQUNFLEVBQUEsQUFBQSxDQUFBLEFBQ0UsaUJBQUEsQ0FBQSxPQUFBLElBQUEsQ0FBQSxDQUNRLFNBQUEsQ0FBQSxPQUFBLElBQUEsQ0FBQSxBRnUrQ1YsQ0FBQSxBRXQrQ0EsSUFBQSxBQUFBLENBQUEsQUFDRSxpQkFBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQ1EsU0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLEFGdytDVixDQUFBLEFBQ0YsQ0FBQSxBRXYrQ0EsV0FBQSxBQUFBLE9BQUEsQUFBQSxDQUFBLEFBQ0UsRUFBQSxBQUFBLENBQUEsQUFDRSxpQkFBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLENBQ1EsU0FBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLEFGeStDVixDQUFBLEFFeCtDQSxJQUFBLEFBQUEsQ0FBQSxBQUNFLGlCQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQ0FDUSxTQUFBLENBQUEsT0FBQSxNQUFBLENBQUEsQUYwK0NWLENBQUEsQUFDRixDQUFBLEFFeitDQSxhQUFBLEFBQUEsQ0FBQSxBQUNFLFVBQUEsQ0FBQSwwREFBQSxDQUNBLGlCQUFBLENBQUEsT0FBQSxLQUFBLENBQUEsQ0FDUSxTQUFBLENBQUEsT0FBQSxLQUFBLENBQUEsQUYyK0NWLENBQUEsQUV6K0NBLGNBQUEsQUFBQSxDQUFBLEFBQ0UsVUFBQSxDQUFBLDBEQUFBLENBQ0EsaUJBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUNRLFNBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxBRjQrQ1YsQ0FBQSxBRTErQ0EsY0FBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsMERBQUEsQ0FDQSxpQkFBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQ1EsU0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLEFGNitDVixDQUFBLEFFMytDQSxtQkFBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsb0VBQUEsQ0FDQSxpQkFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQ1EsU0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEFGOCtDVixDQUFBLEFFNStDQSxpQkFBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsb0VBQUEsQ0FDQSxpQkFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQ1EsU0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEFGKytDVixDQUFBLEFFNytDQSxhQUFBLEFBQUEsQ0FBQSxvQ0FBQSxBQUFBLENBQUEsQUFDRSxVQUFBLENBQUEsb0VBQUEsQ0FDQSxpQkFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQ1EsU0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEFGZy9DVixDQUFBLEFFOStDQSxLQUFBLEFBQUEsQ0FBQSxBQUFBLGFBQUEsQUFBQSxpSEFNRSxjQUFBLENBQUEsSUFBQSxDQUNRLE1BQUEsQ0FBQSxJQUFBLEFGaS9DVixDQUFBLEFFLytDQSxTQUFBLEFBQUEsQ0FBQSxBQUNFLE9BQUEsQ0FBQSxZQUFBLENBQ0EsTUFBQSxDQUFBLEdBQUEsQ0FDQSxRQUFBLENBQUEsUUFBQSxDQUNBLEtBQUEsQ0FBQSxLQUFBLEFGay9DRixDQUFBLEFFaC9DQSxZQUFBLEFBQUEsY0FFRSxNQUFBLENBQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxDQUFBLENBQ0EsTUFBQSxDQUFBLElBQUEsQ0FDQSxRQUFBLENBQUEsUUFBQSxDQUNBLEtBQUEsQ0FBQSxDQUFBLENBQ0EsR0FBQSxDQUFBLENBQUEsQUZtL0NGLENBQUEsQUVqL0NBLDJCQUFBLEFBQUEsQ0FBQSxBQUNFLE1BQUEsQ0FBQSxHQUFBLENBQ0EsS0FBQSxDQUFBLE1BQUEsQUZvL0NGLENBQUEsQUVsL0NBLDJCQUFBLEFBQUEsQ0FBQSxBQUNFLE1BQUEsQ0FBQSxHQUFBLENBQ0EsS0FBQSxDQUFBLEtBQUEsQUZxL0NGLENBQUEsQUVuL0NBLFdBQUEsQUFBQSxDQUFBLEFBQ0UsS0FBQSxDQUFBLElBQUEsQUZzL0NGLENBQUEsQUVwL0NBLFFBQUEsQUFBQSxDQUFBLEFBQ0UsTUFBQSxDQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FDQSxNQUFBLENBQUEsR0FBQSxDQUNBLE1BQUEsQ0FBQSxJQUFBLENBQ0EsUUFBQSxDQUFBLE1BQUEsQ0FDQSxPQUFBLENBQUEsQ0FBQSxDQUNBLFFBQUEsQ0FBQSxRQUFBLENBQ0EsS0FBQSxDQUFBLEdBQUEsQUZ1L0NGLENBQUEsQUVyL0NBLHlCQUFBLEFBQUEsQ0FBQSx3QkFBQSxBQUFBLENBQUEsQUFDRSxJQUFBLENBQUEsSUFBQSxDQUNBLE1BQUEsQ0FBQSxJQUFBLENBQ0EsTUFBQSxDQUFBLENBQUEsQ0FDQSxRQUFBLENBQUEsT0FBQSxDQUNBLFFBQUEsQ0FBQSxNQUFBLENBQ0EsS0FBQSxDQUFBLElBQUEsQUZ3L0NGLENBQUEsQUV0L0NBLGVBQUEsQUFBQSxDQUFBLEFBQUEsV0FBQSxBQUFBLENBQUEsQUFDRSxJQUFBLENBQUEsSUFBQSxrQkFBQSxDQUFBLGFBQUEsQ0FBQSxDQUNBLE9BQUEsQ0FBQSxDQUFBLENBQ0EsT0FBQSxDQUFBLElBQUEsb0JBQUEsQ0FBQSxFQUFBLENBQUEsQUZ5L0NGLENBQUEsQUV2L0NBLGVBQUEsQUFBQSxDQUFBLEFBQUEsYUFBQSxBQUFBLENBQUEsQUFDRSxJQUFBLENBQUEsSUFBQSxvQkFBQSxDQUFBLGFBQUEsQ0FBQSxDQUNBLE9BQUEsQ0FBQSxHQUFBLENBQ0EsT0FBQSxDQUFBLElBQUEsc0JBQUEsQ0FBQSxJQUFBLENBQUEsQUYwL0NGLENBQUEsQUV4L0NBLCtCQUFBLEFBQUEsQ0FBQSxBQUFBLFdBQUEsQUFBQSxDQUFBLEFBQ0UsT0FBQSxDQUFBLEdBQUEsQ0FDQSxPQUFBLENBQUEsSUFBQSxzQkFBQSxDQUFBLElBQUEsQ0FBQSxBRjIvQ0YsQ0FBQSxBRXovQ0EsK0JBQUEsQUFBQSxDQUFBLEFBQUEsYUFBQSxBQUFBLENBQUEsQUFDRSxPQUFBLENBQUEsQ0FBQSxDQUNBLE9BQUEsQ0FBQSxJQUFBLG9CQUFBLENBQUEsRUFBQSxDQUFBLEFGNC9DRixDQUFBLEFFMS9DQSxlQUFBLEFBQUEsQ0FBQSxBQUFBLElBQUEsQUFBQSxDQUFBLEFBQUEsV0FBQSxBQUFBLG9DQUVFLElBQUEsQ0FBQSxLQUFBLEFGNi9DRixDQUFBLEFFMy9DQSxlQUFBLEFBQUEsQ0FBQSxBQUNFLEtBQUEsQ0FBQSxJQUFBLEFGOC9DRixDQUFBLEFHdjJESSxHQUFBLEFBQUEsQ0FBQSxBQUNJLFVBQUEsQ0FBQSxLQUFBLENBQ0EsYUFBQSxDQUFBLEdBQUEsQ0FDQSxTQUFBLENBQUEsSUFBQSxDQUNBLE1BQUEsQ0FBQSxJQUFBLEFIMDJEUixDQUFBLEFHdjJESSxJQUFBLEFBQUEsQ0FBQSxBQUNJLE9BQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxDQUNBLFNBQUEsQ0FBQSxHQUFBLENBQ0EsS0FBQSxDQUFBLElBQUEsQ0FDQSxXQUFBLENBQUEsUUFBQSxDQUNBLGFBQUEsQ0FBQSxHQUFBLENBQ0EsT0FBQSxDQUFBLEtBQUEsQ0FBQSxLQUFBLENBQ0EsZ0JBQUEsQ0FBQSxPQUFBLENBQ0EsV0FBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLFNBQUEsQUgwMkRSLENBQUEsQUd2MkRJLENBQUEsQUFBQSxDQUFBLEFBQ0ksS0FBQSxDQUFBLElBQUEsd0JBQUEsQ0FBQSxBSDAyRFIsQ0FBQSxBR3YyREksaUJBQUEsQUFBQSxDQUFBLEFBQ0ksT0FBQSxDQUFBLElBQUEsQ0FDQSxTQUFBLENBQUEsS0FBQSxDQUNBLE1BQUEsQ0FBQSxJQUFBLEFIMDJEUixDSTlzREEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiZmlsZTovLy9Vc2Vycy9raS9WaXN1YWxTdHVkaW9Db2RlUHJvamVjdHMvcXVpemRvd24tanMvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zdHlsZXMvZ2l0aHViLmNzcyIsInNyYy9BcHAuc3ZlbHRlIiwiZmlsZTovLy9Vc2Vycy9raS9WaXN1YWxTdHVkaW9Db2RlUHJvamVjdHMvcXVpemRvd24tanMvbm9kZV9tb2R1bGVzL2thdGV4L2Rpc3Qva2F0ZXguY3NzIiwiZmlsZTovLy9Vc2Vycy9raS9WaXN1YWxTdHVkaW9Db2RlUHJvamVjdHMvcXVpemRvd24tanMvbm9kZV9tb2R1bGVzL0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZS9zdHlsZXMuY3NzIiwiZmlsZTovLy9Vc2Vycy9raS9WaXN1YWxTdHVkaW9Db2RlUHJvamVjdHMvcXVpemRvd24tanMvc3JjL0FwcC5zdmVsdGUiLCJBcHAuc3ZlbHRlIl19 */");
    }

    // (73:24) {:else}
    function create_else_block(ctx) {
    	let questionview;
    	let t;
    	let hint;
    	let current;

    	questionview = new QuestionView({
    			props: {
    				question: /*$question*/ ctx[1],
    				n: /*$index*/ ctx[13] + 1
    			},
    			$$inline: true
    		});

    	hint = new Hint({
    			props: {
    				hint: /*$question*/ ctx[1].hint,
    				show: /*$showHint*/ ctx[15]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(questionview.$$.fragment);
    			t = space();
    			create_component(hint.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(questionview, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(hint, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const questionview_changes = {};
    			if (dirty & /*$question*/ 2) questionview_changes.question = /*$question*/ ctx[1];
    			if (dirty & /*$index*/ 8192) questionview_changes.n = /*$index*/ ctx[13] + 1;
    			questionview.$set(questionview_changes);
    			const hint_changes = {};
    			if (dirty & /*$question*/ 2) hint_changes.hint = /*$question*/ ctx[1].hint;
    			if (dirty & /*$showHint*/ 32768) hint_changes.show = /*$showHint*/ ctx[15];
    			hint.$set(hint_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(questionview.$$.fragment, local);
    			transition_in(hint.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(questionview.$$.fragment, local);
    			transition_out(hint.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(questionview, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(hint, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(73:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:24) {#if $onResults}
    function create_if_block_2(ctx) {
    	let resultsview;
    	let current;

    	resultsview = new ResultsView({
    			props: { quiz: /*quiz*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(resultsview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(resultsview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const resultsview_changes = {};
    			if (dirty & /*quiz*/ 1) resultsview_changes.quiz = /*quiz*/ ctx[0];
    			resultsview.$set(resultsview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(resultsview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(resultsview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(resultsview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(71:24) {#if $onResults}",
    		ctx
    	});

    	return block;
    }

    // (70:20) <Animated update="{$index}">
    function create_default_slot_14(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$onResults*/ ctx[14]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(70:20) <Animated update=\\\"{$index}\\\">",
    		ctx
    	});

    	return block;
    }

    // (69:16) <SmoothResize minHeight="{minHeight}">
    function create_default_slot_13(ctx) {
    	let animated;
    	let current;

    	animated = new Animated({
    			props: {
    				update: /*$index*/ ctx[13],
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(animated.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(animated, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const animated_changes = {};
    			if (dirty & /*$index*/ 8192) animated_changes.update = /*$index*/ ctx[13];

    			if (dirty & /*$$scope, quiz, $onResults, $question, $showHint, $index*/ 134275075) {
    				animated_changes.$$scope = { dirty, ctx };
    			}

    			animated.$set(animated_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(animated.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(animated.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(animated, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(69:16) <SmoothResize minHeight=\\\"{minHeight}\\\">",
    		ctx
    	});

    	return block;
    }

    // (86:20) <Button                         slot="left"                         title="{$_('hint')}"                         disabled="{!$question.hint || $showHint || $onResults}"                         buttonAction="{$question.enableHint}"                         >
    function create_default_slot_12(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { name: "lightbulb", solid: false },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(86:20) <Button                         slot=\\\"left\\\"                         title=\\\"{$_('hint')}\\\"                         disabled=\\\"{!$question.hint || $showHint || $onResults}\\\"                         buttonAction=\\\"{$question.enableHint}\\\"                         >",
    		ctx
    	});

    	return block;
    }

    // (86:20) 
    function create_left_slot(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				slot: "left",
    				title: /*$_*/ ctx[16]('hint'),
    				disabled: !/*$question*/ ctx[1].hint || /*$showHint*/ ctx[15] || /*$onResults*/ ctx[14],
    				buttonAction: /*$question*/ ctx[1].enableHint,
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*$_*/ 65536) button_changes.title = /*$_*/ ctx[16]('hint');
    			if (dirty & /*$question, $showHint, $onResults*/ 49154) button_changes.disabled = !/*$question*/ ctx[1].hint || /*$showHint*/ ctx[15] || /*$onResults*/ ctx[14];
    			if (dirty & /*$question*/ 2) button_changes.buttonAction = /*$question*/ ctx[1].enableHint;

    			if (dirty & /*$$scope*/ 134217728) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_left_slot.name,
    		type: "slot",
    		source: "(86:20) ",
    		ctx
    	});

    	return block;
    }

    // (94:24) <Button                             title="{$_('previous')}"                             disabled="{$onFirst || $onResults || $isEvaluated}"                             buttonAction="{quiz.previous}"                             >
    function create_default_slot_11(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { name: "arrow-left", size: "lg" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(94:24) <Button                             title=\\\"{$_('previous')}\\\"                             disabled=\\\"{$onFirst || $onResults || $isEvaluated}\\\"                             buttonAction=\\\"{quiz.previous}\\\"                             >",
    		ctx
    	});

    	return block;
    }

    // (101:24) <Button                             disabled="{$onLast || $onResults || $isEvaluated}"                             buttonAction="{quiz.next}"                             title="{$_('next')}"                             >
    function create_default_slot_10(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { name: "arrow-right", size: "lg" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(101:24) <Button                             disabled=\\\"{$onLast || $onResults || $isEvaluated}\\\"                             buttonAction=\\\"{quiz.next}\\\"                             title=\\\"{$_('next')}\\\"                             >",
    		ctx
    	});

    	return block;
    }

    // (108:24) {#if $onLast || $allVisited}
    function create_if_block_1(ctx) {
    	let div;
    	let button;
    	let div_intro;
    	let current;

    	button = new Button({
    			props: {
    				disabled: !(/*$onLast*/ ctx[19] || /*$allVisited*/ ctx[20]) || /*$onResults*/ ctx[14],
    				title: /*$_*/ ctx[16]('evaluate'),
    				buttonAction: /*func_1*/ ctx[23],
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			add_location(div, file, 108, 28, 4967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*$onLast, $allVisited, $onResults*/ 1589248) button_changes.disabled = !(/*$onLast*/ ctx[19] || /*$allVisited*/ ctx[20]) || /*$onResults*/ ctx[14];
    			if (dirty & /*$_*/ 65536) button_changes.title = /*$_*/ ctx[16]('evaluate');
    			if (dirty & /*quiz*/ 1) button_changes.buttonAction = /*func_1*/ ctx[23];

    			if (dirty & /*$$scope*/ 134217728) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fly, { x: 200, duration: 500 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(108:24) {#if $onLast || $allVisited}",
    		ctx
    	});

    	return block;
    }

    // (110:32) <Button                                     disabled="{!($onLast || $allVisited) ||                                         $onResults}"                                     title="{$_('evaluate')}"                                     buttonAction="{() =>                                         quiz.jump(quiz.questions.length)}"                                     >
    function create_default_slot_9(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { name: "check-double", size: "lg" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(110:32) <Button                                     disabled=\\\"{!($onLast || $allVisited) ||                                         $onResults}\\\"                                     title=\\\"{$_('evaluate')}\\\"                                     buttonAction=\\\"{() =>                                         quiz.jump(quiz.questions.length)}\\\"                                     >",
    		ctx
    	});

    	return block;
    }

    // (93:20) <svelte:fragment slot="center">
    function create_center_slot(ctx) {
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let if_block_anchor;
    	let current;

    	button0 = new Button({
    			props: {
    				title: /*$_*/ ctx[16]('previous'),
    				disabled: /*$onFirst*/ ctx[17] || /*$onResults*/ ctx[14] || /*$isEvaluated*/ ctx[18],
    				buttonAction: /*quiz*/ ctx[0].previous,
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				disabled: /*$onLast*/ ctx[19] || /*$onResults*/ ctx[14] || /*$isEvaluated*/ ctx[18],
    				buttonAction: /*quiz*/ ctx[0].next,
    				title: /*$_*/ ctx[16]('next'),
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = (/*$onLast*/ ctx[19] || /*$allVisited*/ ctx[20]) && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t0 = space();
    			create_component(button1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};
    			if (dirty & /*$_*/ 65536) button0_changes.title = /*$_*/ ctx[16]('previous');
    			if (dirty & /*$onFirst, $onResults, $isEvaluated*/ 409600) button0_changes.disabled = /*$onFirst*/ ctx[17] || /*$onResults*/ ctx[14] || /*$isEvaluated*/ ctx[18];
    			if (dirty & /*quiz*/ 1) button0_changes.buttonAction = /*quiz*/ ctx[0].previous;

    			if (dirty & /*$$scope*/ 134217728) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};
    			if (dirty & /*$onLast, $onResults, $isEvaluated*/ 802816) button1_changes.disabled = /*$onLast*/ ctx[19] || /*$onResults*/ ctx[14] || /*$isEvaluated*/ ctx[18];
    			if (dirty & /*quiz*/ 1) button1_changes.buttonAction = /*quiz*/ ctx[0].next;
    			if (dirty & /*$_*/ 65536) button1_changes.title = /*$_*/ ctx[16]('next');

    			if (dirty & /*$$scope*/ 134217728) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (/*$onLast*/ ctx[19] || /*$allVisited*/ ctx[20]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$onLast, $allVisited*/ 1572864) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_center_slot.name,
    		type: "slot",
    		source: "(93:20) <svelte:fragment slot=\\\"center\\\">",
    		ctx
    	});

    	return block;
    }

    // (125:20) <Button                         slot="right"                         title="{$_('reset')}"                         buttonAction="{() => {                             reloaded = !reloaded;                             quiz.reset();                         }}">
    function create_default_slot_8(ctx) {
    	let icon;
    	let current;
    	icon = new Icon({ props: { name: "redo" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(125:20) <Button                         slot=\\\"right\\\"                         title=\\\"{$_('reset')}\\\"                         buttonAction=\\\"{() => {                             reloaded = !reloaded;                             quiz.reset();                         }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (125:20) 
    function create_right_slot(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				slot: "right",
    				title: /*$_*/ ctx[16]('reset'),
    				buttonAction: /*func*/ ctx[22],
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*$_*/ 65536) button_changes.title = /*$_*/ ctx[16]('reset');
    			if (dirty & /*reloaded, quiz*/ 9) button_changes.buttonAction = /*func*/ ctx[22];

    			if (dirty & /*$$scope*/ 134217728) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_right_slot.name,
    		type: "slot",
    		source: "(125:20) ",
    		ctx
    	});

    	return block;
    }

    // (68:12) <Container>
    function create_default_slot_7(ctx) {
    	let smoothresize;
    	let t0;
    	let row;
    	let t1;
    	let credits;
    	let current;

    	smoothresize = new SmoothResize({
    			props: {
    				minHeight: /*minHeight*/ ctx[21],
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row = new Row({
    			props: {
    				$$slots: {
    					right: [create_right_slot],
    					center: [create_center_slot],
    					left: [create_left_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	credits = new Credits({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(smoothresize.$$.fragment);
    			t0 = space();
    			create_component(row.$$.fragment);
    			t1 = space();
    			create_component(credits.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(smoothresize, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(row, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(credits, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const smoothresize_changes = {};

    			if (dirty & /*$$scope, $index, quiz, $onResults, $question, $showHint*/ 134275075) {
    				smoothresize_changes.$$scope = { dirty, ctx };
    			}

    			smoothresize.$set(smoothresize_changes);
    			const row_changes = {};

    			if (dirty & /*$$scope, $_, reloaded, quiz, $onLast, $allVisited, $onResults, $isEvaluated, $onFirst, $question, $showHint*/ 136298507) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(smoothresize.$$.fragment, local);
    			transition_in(row.$$.fragment, local);
    			transition_in(credits.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(smoothresize.$$.fragment, local);
    			transition_out(row.$$.fragment, local);
    			transition_out(credits.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(smoothresize, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(row, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(credits, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(68:12) <Container>",
    		ctx
    	});

    	return block;
    }

    // (67:8) <Loading update="{reloaded}" ms="{800}" minHeight="{minHeight}">
    function create_default_slot_6(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, $_, reloaded, quiz, $onLast, $allVisited, $onResults, $isEvaluated, $onFirst, $question, $showHint, $index*/ 136306699) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(67:8) <Loading update=\\\"{reloaded}\\\" ms=\\\"{800}\\\" minHeight=\\\"{minHeight}\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:4) <Card>
    function create_default_slot_5(ctx) {
    	let progressbar;
    	let t;
    	let loading;
    	let current;

    	progressbar = new ProgressBar({
    			props: {
    				value: /*$index*/ ctx[13],
    				max: /*quiz*/ ctx[0].questions.length - 1
    			},
    			$$inline: true
    		});

    	loading = new Loading({
    			props: {
    				update: /*reloaded*/ ctx[3],
    				ms: 800,
    				minHeight: /*minHeight*/ ctx[21],
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(progressbar.$$.fragment);
    			t = space();
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progressbar, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar_changes = {};
    			if (dirty & /*$index*/ 8192) progressbar_changes.value = /*$index*/ ctx[13];
    			if (dirty & /*quiz*/ 1) progressbar_changes.max = /*quiz*/ ctx[0].questions.length - 1;
    			progressbar.$set(progressbar_changes);
    			const loading_changes = {};
    			if (dirty & /*reloaded*/ 8) loading_changes.update = /*reloaded*/ ctx[3];

    			if (dirty & /*$$scope, $_, reloaded, quiz, $onLast, $allVisited, $onResults, $isEvaluated, $onFirst, $question, $showHint, $index*/ 136306699) {
    				loading_changes.$$scope = { dirty, ctx };
    			}

    			loading.$set(loading_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progressbar, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(65:4) <Card>",
    		ctx
    	});

    	return block;
    }

    // (138:4) {#if (localStorageHasResults)}
    function create_if_block(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope, reloaded, $index, quiz*/ 134225929) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(138:4) {#if (localStorageHasResults)}",
    		ctx
    	});

    	return block;
    }

    // (144:20) <Animated update="{$index}">
    function create_default_slot_4(ctx) {
    	let resultsoverview;
    	let current;
    	resultsoverview = new ResultsOverview_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(resultsoverview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(resultsoverview, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(resultsoverview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(resultsoverview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(resultsoverview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(144:20) <Animated update=\\\"{$index}\\\">",
    		ctx
    	});

    	return block;
    }

    // (143:16) <SmoothResize minHeight="{minHeight}">
    function create_default_slot_3(ctx) {
    	let animated;
    	let current;

    	animated = new Animated({
    			props: {
    				update: /*$index*/ ctx[13],
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(animated.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(animated, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const animated_changes = {};
    			if (dirty & /*$index*/ 8192) animated_changes.update = /*$index*/ ctx[13];

    			if (dirty & /*$$scope*/ 134217728) {
    				animated_changes.$$scope = { dirty, ctx };
    			}

    			animated.$set(animated_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(animated.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(animated.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(animated, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(143:16) <SmoothResize minHeight=\\\"{minHeight}\\\">",
    		ctx
    	});

    	return block;
    }

    // (142:12) <Container>
    function create_default_slot_2(ctx) {
    	let smoothresize;
    	let current;

    	smoothresize = new SmoothResize({
    			props: {
    				minHeight: /*minHeight*/ ctx[21],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(smoothresize.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(smoothresize, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const smoothresize_changes = {};

    			if (dirty & /*$$scope, $index*/ 134225920) {
    				smoothresize_changes.$$scope = { dirty, ctx };
    			}

    			smoothresize.$set(smoothresize_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(smoothresize.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(smoothresize.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(smoothresize, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(142:12) <Container>",
    		ctx
    	});

    	return block;
    }

    // (141:8) <Loading update="{reloaded}" ms="{800}" minHeight="{minHeight}">
    function create_default_slot_1(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, $index*/ 134225920) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(141:8) <Loading update=\\\"{reloaded}\\\" ms=\\\"{800}\\\" minHeight=\\\"{minHeight}\\\">",
    		ctx
    	});

    	return block;
    }

    // (139:4) <Card>
    function create_default_slot(ctx) {
    	let progressbar;
    	let t;
    	let loading;
    	let current;

    	progressbar = new ProgressBar({
    			props: {
    				value: /*$index*/ ctx[13],
    				max: /*quiz*/ ctx[0].questions.length - 1
    			},
    			$$inline: true
    		});

    	loading = new Loading({
    			props: {
    				update: /*reloaded*/ ctx[3],
    				ms: 800,
    				minHeight: /*minHeight*/ ctx[21],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(progressbar.$$.fragment);
    			t = space();
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progressbar, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar_changes = {};
    			if (dirty & /*$index*/ 8192) progressbar_changes.value = /*$index*/ ctx[13];
    			if (dirty & /*quiz*/ 1) progressbar_changes.max = /*quiz*/ ctx[0].questions.length - 1;
    			progressbar.$set(progressbar_changes);
    			const loading_changes = {};
    			if (dirty & /*reloaded*/ 8) loading_changes.update = /*reloaded*/ ctx[3];

    			if (dirty & /*$$scope, $index*/ 134225920) {
    				loading_changes.$$scope = { dirty, ctx };
    			}

    			loading.$set(loading_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progressbar, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(139:4) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let card;
    	let t;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*localStorageHasResults*/ ctx[4] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(card.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "quizdown-content");
    			add_location(div, file, 63, 0, 2928);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[24](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, reloaded, $_, quiz, $onLast, $allVisited, $onResults, $isEvaluated, $onFirst, $question, $showHint, $index*/ 136306699) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);

    			if (/*localStorageHasResults*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*localStorageHasResults*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[24](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let question;
    	let showHint;
    	let index;
    	let onLast;
    	let onFirst;
    	let onResults;
    	let isEvaluated;
    	let allVisited;
    	let localStorageHasResults;

    	let $question,
    		$$unsubscribe_question = noop$2,
    		$$subscribe_question = () => ($$unsubscribe_question(), $$unsubscribe_question = subscribe(question, $$value => $$invalidate(1, $question = $$value)), question);

    	let $index,
    		$$unsubscribe_index = noop$2,
    		$$subscribe_index = () => ($$unsubscribe_index(), $$unsubscribe_index = subscribe(index, $$value => $$invalidate(13, $index = $$value)), index);

    	let $onResults,
    		$$unsubscribe_onResults = noop$2,
    		$$subscribe_onResults = () => ($$unsubscribe_onResults(), $$unsubscribe_onResults = subscribe(onResults, $$value => $$invalidate(14, $onResults = $$value)), onResults);

    	let $showHint,
    		$$unsubscribe_showHint = noop$2,
    		$$subscribe_showHint = () => ($$unsubscribe_showHint(), $$unsubscribe_showHint = subscribe(showHint, $$value => $$invalidate(15, $showHint = $$value)), showHint);

    	let $_;

    	let $onFirst,
    		$$unsubscribe_onFirst = noop$2,
    		$$subscribe_onFirst = () => ($$unsubscribe_onFirst(), $$unsubscribe_onFirst = subscribe(onFirst, $$value => $$invalidate(17, $onFirst = $$value)), onFirst);

    	let $isEvaluated,
    		$$unsubscribe_isEvaluated = noop$2,
    		$$subscribe_isEvaluated = () => ($$unsubscribe_isEvaluated(), $$unsubscribe_isEvaluated = subscribe(isEvaluated, $$value => $$invalidate(18, $isEvaluated = $$value)), isEvaluated);

    	let $onLast,
    		$$unsubscribe_onLast = noop$2,
    		$$subscribe_onLast = () => ($$unsubscribe_onLast(), $$unsubscribe_onLast = subscribe(onLast, $$value => $$invalidate(19, $onLast = $$value)), onLast);

    	let $allVisited,
    		$$unsubscribe_allVisited = noop$2,
    		$$subscribe_allVisited = () => ($$unsubscribe_allVisited(), $$unsubscribe_allVisited = subscribe(allVisited, $$value => $$invalidate(20, $allVisited = $$value)), allVisited);

    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(16, $_ = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_question());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_index());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_onResults());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_showHint());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_onFirst());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_isEvaluated());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_onLast());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_allVisited());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};
    	let { quiz } = $$props;

    	//let game = new Linear(quiz);
    	registerLanguages(quiz.config.locale);

    	registerIcons();
    	let node;
    	let minHeight = 150;
    	let reloaded = false;

    	// let showModal = false;
    	// set global options
    	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    		let primaryColor = quiz.config.primaryColor;
    		let secondaryColor = quiz.config.secondaryColor;
    		let textColor = quiz.config.textColor;
    		node.style.setProperty('--quizdown-color-primary', primaryColor);
    		node.style.setProperty('--quizdown-color-secondary', secondaryColor);
    		node.style.setProperty('--quizdown-color-text', textColor);
    		$$invalidate(2, node.style.minHeight = `${minHeight}px`, node);
    	}));

    	let resultsOverview = new ResultsOverview();
    	const writable_props = ['quiz'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func = () => {
    		$$invalidate(3, reloaded = !reloaded);
    		quiz.reset();
    	};

    	const func_1 = () => quiz.jump(quiz.questions.length);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			node = $$value;
    			$$invalidate(2, node);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('quiz' in $$props) $$invalidate(0, quiz = $$props.quiz);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		ProgressBar,
    		onMount,
    		registerLanguages,
    		Card,
    		Credits,
    		SmoothResize,
    		QuestionView,
    		Row,
    		Button,
    		_: X,
    		ResultsView,
    		Animated,
    		registerIcons,
    		Icon,
    		Hint,
    		fly,
    		Container,
    		Loading,
    		ResultsOverview: ResultsOverview_1,
    		ResultsOverviewClass: ResultsOverview,
    		config,
    		quiz,
    		node,
    		minHeight,
    		reloaded,
    		resultsOverview,
    		localStorageHasResults,
    		allVisited,
    		isEvaluated,
    		onResults,
    		onFirst,
    		onLast,
    		index,
    		showHint,
    		question,
    		$question,
    		$index,
    		$onResults,
    		$showHint,
    		$_,
    		$onFirst,
    		$isEvaluated,
    		$onLast,
    		$allVisited
    	});

    	$$self.$inject_state = $$props => {
    		if ('__awaiter' in $$props) __awaiter = $$props.__awaiter;
    		if ('quiz' in $$props) $$invalidate(0, quiz = $$props.quiz);
    		if ('node' in $$props) $$invalidate(2, node = $$props.node);
    		if ('minHeight' in $$props) $$invalidate(21, minHeight = $$props.minHeight);
    		if ('reloaded' in $$props) $$invalidate(3, reloaded = $$props.reloaded);
    		if ('resultsOverview' in $$props) $$invalidate(26, resultsOverview = $$props.resultsOverview);
    		if ('localStorageHasResults' in $$props) $$invalidate(4, localStorageHasResults = $$props.localStorageHasResults);
    		if ('allVisited' in $$props) $$subscribe_allVisited($$invalidate(5, allVisited = $$props.allVisited));
    		if ('isEvaluated' in $$props) $$subscribe_isEvaluated($$invalidate(6, isEvaluated = $$props.isEvaluated));
    		if ('onResults' in $$props) $$subscribe_onResults($$invalidate(7, onResults = $$props.onResults));
    		if ('onFirst' in $$props) $$subscribe_onFirst($$invalidate(8, onFirst = $$props.onFirst));
    		if ('onLast' in $$props) $$subscribe_onLast($$invalidate(9, onLast = $$props.onLast));
    		if ('index' in $$props) $$subscribe_index($$invalidate(10, index = $$props.index));
    		if ('showHint' in $$props) $$subscribe_showHint($$invalidate(11, showHint = $$props.showHint));
    		if ('question' in $$props) $$subscribe_question($$invalidate(12, question = $$props.question));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			// https://github.com/sveltejs/svelte/issues/4079
    			$$subscribe_question($$invalidate(12, question = quiz.active));
    		}

    		if ($$self.$$.dirty & /*$question*/ 2) {
    			$$subscribe_showHint($$invalidate(11, showHint = $question.showHint));
    		}

    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_index($$invalidate(10, index = quiz.index));
    		}

    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_onLast($$invalidate(9, onLast = quiz.onLast));
    		}

    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_onFirst($$invalidate(8, onFirst = quiz.onFirst));
    		}

    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_onResults($$invalidate(7, onResults = quiz.onResults));
    		}

    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_isEvaluated($$invalidate(6, isEvaluated = quiz.isEvaluated));
    		}

    		if ($$self.$$.dirty & /*quiz*/ 1) {
    			$$subscribe_allVisited($$invalidate(5, allVisited = quiz.allVisited));
    		}
    	};

    	$$invalidate(4, localStorageHasResults = resultsOverview.getQuizesNames().length > 0);

    	return [
    		quiz,
    		$question,
    		node,
    		reloaded,
    		localStorageHasResults,
    		allVisited,
    		isEvaluated,
    		onResults,
    		onFirst,
    		onLast,
    		index,
    		showHint,
    		question,
    		$index,
    		$onResults,
    		$showHint,
    		$_,
    		$onFirst,
    		$isEvaluated,
    		$onLast,
    		$allVisited,
    		minHeight,
    		func,
    		func_1,
    		div_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal, { quiz: 0 }, add_css);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quiz*/ ctx[0] === undefined && !('quiz' in props)) {
    			console.warn("<App> was created without expected prop 'quiz'");
    		}
    	}

    	get quiz() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quiz(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*! @license DOMPurify 2.3.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.3.0/LICENSE */

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

    var hasOwnProperty = Object.hasOwnProperty,
        setPrototypeOf = Object.setPrototypeOf,
        isFrozen = Object.isFrozen,
        getPrototypeOf = Object.getPrototypeOf,
        getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var freeze = Object.freeze,
        seal = Object.seal,
        create = Object.create; // eslint-disable-line import/no-mutable-exports

    var _ref = typeof Reflect !== 'undefined' && Reflect,
        apply = _ref.apply,
        construct = _ref.construct;

    if (!apply) {
      apply = function apply(fun, thisValue, args) {
        return fun.apply(thisValue, args);
      };
    }

    if (!freeze) {
      freeze = function freeze(x) {
        return x;
      };
    }

    if (!seal) {
      seal = function seal(x) {
        return x;
      };
    }

    if (!construct) {
      construct = function construct(Func, args) {
        return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray(args))))();
      };
    }

    var arrayForEach = unapply(Array.prototype.forEach);
    var arrayPop = unapply(Array.prototype.pop);
    var arrayPush = unapply(Array.prototype.push);

    var stringToLowerCase = unapply(String.prototype.toLowerCase);
    var stringMatch = unapply(String.prototype.match);
    var stringReplace = unapply(String.prototype.replace);
    var stringIndexOf = unapply(String.prototype.indexOf);
    var stringTrim = unapply(String.prototype.trim);

    var regExpTest = unapply(RegExp.prototype.test);

    var typeErrorCreate = unconstruct(TypeError);

    function unapply(func) {
      return function (thisArg) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return apply(func, thisArg, args);
      };
    }

    function unconstruct(func) {
      return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return construct(func, args);
      };
    }

    /* Add properties to a lookup table */
    function addToSet(set, array) {
      if (setPrototypeOf) {
        // Make 'in' and truthy checks like Boolean(set.constructor)
        // independent of any properties defined on Object.prototype.
        // Prevent prototype setters from intercepting set as a this value.
        setPrototypeOf(set, null);
      }

      var l = array.length;
      while (l--) {
        var element = array[l];
        if (typeof element === 'string') {
          var lcElement = stringToLowerCase(element);
          if (lcElement !== element) {
            // Config presets (e.g. tags.js, attrs.js) are immutable.
            if (!isFrozen(array)) {
              array[l] = lcElement;
            }

            element = lcElement;
          }
        }

        set[element] = true;
      }

      return set;
    }

    /* Shallow clone an object */
    function clone(object) {
      var newObject = create(null);

      var property = void 0;
      for (property in object) {
        if (apply(hasOwnProperty, object, [property])) {
          newObject[property] = object[property];
        }
      }

      return newObject;
    }

    /* IE10 doesn't support __lookupGetter__ so lets'
     * simulate it. It also automatically checks
     * if the prop is function or getter and behaves
     * accordingly. */
    function lookupGetter(object, prop) {
      while (object !== null) {
        var desc = getOwnPropertyDescriptor(object, prop);
        if (desc) {
          if (desc.get) {
            return unapply(desc.get);
          }

          if (typeof desc.value === 'function') {
            return unapply(desc.value);
          }
        }

        object = getPrototypeOf(object);
      }

      function fallbackValue(element) {
        console.warn('fallback value for', element);
        return null;
      }

      return fallbackValue;
    }

    var html = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);

    // SVG
    var svg = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);

    var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);

    // List of SVG elements that are disallowed by default.
    // We still need to know them so that we can do namespace
    // checks properly in case one wants to add them to
    // allow-list.
    var svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'fedropshadow', 'feimage', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);

    var mathMl = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']);

    // Similarly to SVG, we want to know all MathML elements,
    // even those that we disallow by default.
    var mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);

    var text = freeze(['#text']);

    var html$1 = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns', 'slot']);

    var svg$1 = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);

    var mathMl$1 = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);

    var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

    // eslint-disable-next-line unicorn/better-regex
    var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
    var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
    var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape
    var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
    var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
    );
    var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
    var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
    );

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

    var getGlobal = function getGlobal() {
      return typeof window === 'undefined' ? null : window;
    };

    /**
     * Creates a no-op policy for internal use only.
     * Don't export this function outside this module!
     * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
     * @param {Document} document The document object (to determine policy name suffix)
     * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
     * are not supported).
     */
    var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
      if ((typeof trustedTypes === 'undefined' ? 'undefined' : _typeof(trustedTypes)) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
        return null;
      }

      // Allow the callers to control the unique policy name
      // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
      // Policy creation with duplicate names throws in Trusted Types.
      var suffix = null;
      var ATTR_NAME = 'data-tt-policy-suffix';
      if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
        suffix = document.currentScript.getAttribute(ATTR_NAME);
      }

      var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

      try {
        return trustedTypes.createPolicy(policyName, {
          createHTML: function createHTML(html$$1) {
            return html$$1;
          }
        });
      } catch (_) {
        // Policy creation failed (most likely another DOMPurify script has
        // already run). Skip creating the policy, as this will only cause errors
        // if TT are enforced.
        console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
        return null;
      }
    };

    function createDOMPurify() {
      var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

      var DOMPurify = function DOMPurify(root) {
        return createDOMPurify(root);
      };

      /**
       * Version label, exposed for easier checks
       * if DOMPurify is up to date or not
       */
      DOMPurify.version = '2.3.0';

      /**
       * Array of elements that DOMPurify removed during sanitation.
       * Empty if nothing was removed.
       */
      DOMPurify.removed = [];

      if (!window || !window.document || window.document.nodeType !== 9) {
        // Not running in a browser, provide a factory function
        // so that you can pass your own Window
        DOMPurify.isSupported = false;

        return DOMPurify;
      }

      var originalDocument = window.document;

      var document = window.document;
      var DocumentFragment = window.DocumentFragment,
          HTMLTemplateElement = window.HTMLTemplateElement,
          Node = window.Node,
          Element = window.Element,
          NodeFilter = window.NodeFilter,
          _window$NamedNodeMap = window.NamedNodeMap,
          NamedNodeMap = _window$NamedNodeMap === undefined ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
          Text = window.Text,
          Comment = window.Comment,
          DOMParser = window.DOMParser,
          trustedTypes = window.trustedTypes;


      var ElementPrototype = Element.prototype;

      var cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
      var getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
      var getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
      var getParentNode = lookupGetter(ElementPrototype, 'parentNode');

      // As per issue #47, the web-components registry is inherited by a
      // new document created via createHTMLDocument. As per the spec
      // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
      // a new empty registry is used when creating a template contents owner
      // document, so we use that as our parent document to ensure nothing
      // is inherited.
      if (typeof HTMLTemplateElement === 'function') {
        var template = document.createElement('template');
        if (template.content && template.content.ownerDocument) {
          document = template.content.ownerDocument;
        }
      }

      var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
      var emptyHTML = trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML('') : '';

      var _document = document,
          implementation = _document.implementation,
          createNodeIterator = _document.createNodeIterator,
          createDocumentFragment = _document.createDocumentFragment,
          getElementsByTagName = _document.getElementsByTagName;
      var importNode = originalDocument.importNode;


      var documentMode = {};
      try {
        documentMode = clone(document).documentMode ? document.documentMode : {};
      } catch (_) {}

      var hooks = {};

      /**
       * Expose whether this browser supports running the full DOMPurify.
       */
      DOMPurify.isSupported = typeof getParentNode === 'function' && implementation && typeof implementation.createHTMLDocument !== 'undefined' && documentMode !== 9;

      var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR,
          ERB_EXPR$$1 = ERB_EXPR,
          DATA_ATTR$$1 = DATA_ATTR,
          ARIA_ATTR$$1 = ARIA_ATTR,
          IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA,
          ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
      var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;

      /**
       * We consider the elements and attributes below to be safe. Ideally
       * don't add any new ones but feel free to remove unwanted ones.
       */

      /* allowed element names */

      var ALLOWED_TAGS = null;
      var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(html), _toConsumableArray$1(svg), _toConsumableArray$1(svgFilters), _toConsumableArray$1(mathMl), _toConsumableArray$1(text)));

      /* Allowed attribute names */
      var ALLOWED_ATTR = null;
      var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1(html$1), _toConsumableArray$1(svg$1), _toConsumableArray$1(mathMl$1), _toConsumableArray$1(xml)));

      /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
      var FORBID_TAGS = null;

      /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
      var FORBID_ATTR = null;

      /* Decide if ARIA attributes are okay */
      var ALLOW_ARIA_ATTR = true;

      /* Decide if custom data attributes are okay */
      var ALLOW_DATA_ATTR = true;

      /* Decide if unknown protocols are okay */
      var ALLOW_UNKNOWN_PROTOCOLS = false;

      /* Output should be safe for common template engines.
       * This means, DOMPurify removes data attributes, mustaches and ERB
       */
      var SAFE_FOR_TEMPLATES = false;

      /* Decide if document with <html>... should be returned */
      var WHOLE_DOCUMENT = false;

      /* Track whether config is already set on this instance of DOMPurify. */
      var SET_CONFIG = false;

      /* Decide if all elements (e.g. style, script) must be children of
       * document.body. By default, browsers might move them to document.head */
      var FORCE_BODY = false;

      /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
       * string (or a TrustedHTML object if Trusted Types are supported).
       * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
       */
      var RETURN_DOM = false;

      /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
       * string  (or a TrustedHTML object if Trusted Types are supported) */
      var RETURN_DOM_FRAGMENT = false;

      /* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
       * `Node` is imported into the current `Document`. If this flag is not enabled the
       * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
       * DOMPurify.
       *
       * This defaults to `true` starting DOMPurify 2.2.0. Note that setting it to `false`
       * might cause XSS from attacks hidden in closed shadowroots in case the browser
       * supports Declarative Shadow: DOM https://web.dev/declarative-shadow-dom/
       */
      var RETURN_DOM_IMPORT = true;

      /* Try to return a Trusted Type object instead of a string, return a string in
       * case Trusted Types are not supported  */
      var RETURN_TRUSTED_TYPE = false;

      /* Output should be free from DOM clobbering attacks? */
      var SANITIZE_DOM = true;

      /* Keep element content when removing element? */
      var KEEP_CONTENT = true;

      /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
       * of importing it into a new Document and returning a sanitized copy */
      var IN_PLACE = false;

      /* Allow usage of profiles like html, svg and mathMl */
      var USE_PROFILES = {};

      /* Tags to ignore content of when KEEP_CONTENT is true */
      var FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);

      /* Tags that are safe for data: URIs */
      var DATA_URI_TAGS = null;
      var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);

      /* Attributes safe for values like "javascript:" */
      var URI_SAFE_ATTRIBUTES = null;
      var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'summary', 'title', 'value', 'style', 'xmlns']);

      var MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
      var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
      var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
      /* Document namespace */
      var NAMESPACE = HTML_NAMESPACE;
      var IS_EMPTY_INPUT = false;

      /* Keep a reference to config to pass to hooks */
      var CONFIG = null;

      /* Ideally, do not touch anything below this line */
      /* ______________________________________________ */

      var formElement = document.createElement('form');

      /**
       * _parseConfig
       *
       * @param  {Object} cfg optional config literal
       */
      // eslint-disable-next-line complexity
      var _parseConfig = function _parseConfig(cfg) {
        if (CONFIG && CONFIG === cfg) {
          return;
        }

        /* Shield configuration object from tampering */
        if (!cfg || (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object') {
          cfg = {};
        }

        /* Shield configuration object from prototype pollution */
        cfg = clone(cfg);

        /* Set configuration parameters */
        ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
        ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
        URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
        DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS;
        FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
        FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
        USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
        ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
        ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
        ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
        SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
        WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
        RETURN_DOM = cfg.RETURN_DOM || false; // Default false
        RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
        RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT !== false; // Default true
        RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
        FORCE_BODY = cfg.FORCE_BODY || false; // Default false
        SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
        KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
        IN_PLACE = cfg.IN_PLACE || false; // Default false
        IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
        NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
        if (SAFE_FOR_TEMPLATES) {
          ALLOW_DATA_ATTR = false;
        }

        if (RETURN_DOM_FRAGMENT) {
          RETURN_DOM = true;
        }

        /* Parse profile info */
        if (USE_PROFILES) {
          ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(text)));
          ALLOWED_ATTR = [];
          if (USE_PROFILES.html === true) {
            addToSet(ALLOWED_TAGS, html);
            addToSet(ALLOWED_ATTR, html$1);
          }

          if (USE_PROFILES.svg === true) {
            addToSet(ALLOWED_TAGS, svg);
            addToSet(ALLOWED_ATTR, svg$1);
            addToSet(ALLOWED_ATTR, xml);
          }

          if (USE_PROFILES.svgFilters === true) {
            addToSet(ALLOWED_TAGS, svgFilters);
            addToSet(ALLOWED_ATTR, svg$1);
            addToSet(ALLOWED_ATTR, xml);
          }

          if (USE_PROFILES.mathMl === true) {
            addToSet(ALLOWED_TAGS, mathMl);
            addToSet(ALLOWED_ATTR, mathMl$1);
            addToSet(ALLOWED_ATTR, xml);
          }
        }

        /* Merge configuration parameters */
        if (cfg.ADD_TAGS) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone(ALLOWED_TAGS);
          }

          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
        }

        if (cfg.ADD_ATTR) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone(ALLOWED_ATTR);
          }

          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
        }

        if (cfg.ADD_URI_SAFE_ATTR) {
          addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
        }

        /* Add #text in case KEEP_CONTENT is set to true */
        if (KEEP_CONTENT) {
          ALLOWED_TAGS['#text'] = true;
        }

        /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
        if (WHOLE_DOCUMENT) {
          addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
        }

        /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
        if (ALLOWED_TAGS.table) {
          addToSet(ALLOWED_TAGS, ['tbody']);
          delete FORBID_TAGS.tbody;
        }

        // Prevent further manipulation of configuration.
        // Not available in IE8, Safari 5, etc.
        if (freeze) {
          freeze(cfg);
        }

        CONFIG = cfg;
      };

      var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);

      var HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']);

      /* Keep track of all possible SVG and MathML tags
       * so that we can perform the namespace checks
       * correctly. */
      var ALL_SVG_TAGS = addToSet({}, svg);
      addToSet(ALL_SVG_TAGS, svgFilters);
      addToSet(ALL_SVG_TAGS, svgDisallowed);

      var ALL_MATHML_TAGS = addToSet({}, mathMl);
      addToSet(ALL_MATHML_TAGS, mathMlDisallowed);

      /**
       *
       *
       * @param  {Element} element a DOM element whose namespace is being checked
       * @returns {boolean} Return false if the element has a
       *  namespace that a spec-compliant parser would never
       *  return. Return true otherwise.
       */
      var _checkValidNamespace = function _checkValidNamespace(element) {
        var parent = getParentNode(element);

        // In JSDOM, if we're inside shadow DOM, then parentNode
        // can be null. We just simulate parent in this case.
        if (!parent || !parent.tagName) {
          parent = {
            namespaceURI: HTML_NAMESPACE,
            tagName: 'template'
          };
        }

        var tagName = stringToLowerCase(element.tagName);
        var parentTagName = stringToLowerCase(parent.tagName);

        if (element.namespaceURI === SVG_NAMESPACE) {
          // The only way to switch from HTML namespace to SVG
          // is via <svg>. If it happens via any other tag, then
          // it should be killed.
          if (parent.namespaceURI === HTML_NAMESPACE) {
            return tagName === 'svg';
          }

          // The only way to switch from MathML to SVG is via
          // svg if parent is either <annotation-xml> or MathML
          // text integration points.
          if (parent.namespaceURI === MATHML_NAMESPACE) {
            return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
          }

          // We only allow elements that are defined in SVG
          // spec. All others are disallowed in SVG namespace.
          return Boolean(ALL_SVG_TAGS[tagName]);
        }

        if (element.namespaceURI === MATHML_NAMESPACE) {
          // The only way to switch from HTML namespace to MathML
          // is via <math>. If it happens via any other tag, then
          // it should be killed.
          if (parent.namespaceURI === HTML_NAMESPACE) {
            return tagName === 'math';
          }

          // The only way to switch from SVG to MathML is via
          // <math> and HTML integration points
          if (parent.namespaceURI === SVG_NAMESPACE) {
            return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
          }

          // We only allow elements that are defined in MathML
          // spec. All others are disallowed in MathML namespace.
          return Boolean(ALL_MATHML_TAGS[tagName]);
        }

        if (element.namespaceURI === HTML_NAMESPACE) {
          // The only way to switch from SVG to HTML is via
          // HTML integration points, and from MathML to HTML
          // is via MathML text integration points
          if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
            return false;
          }

          if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
            return false;
          }

          // Certain elements are allowed in both SVG and HTML
          // namespace. We need to specify them explicitly
          // so that they don't get erronously deleted from
          // HTML namespace.
          var commonSvgAndHTMLElements = addToSet({}, ['title', 'style', 'font', 'a', 'script']);

          // We disallow tags that are specific for MathML
          // or SVG and should never appear in HTML namespace
          return !ALL_MATHML_TAGS[tagName] && (commonSvgAndHTMLElements[tagName] || !ALL_SVG_TAGS[tagName]);
        }

        // The code should never reach this place (this means
        // that the element somehow got namespace that is not
        // HTML, SVG or MathML). Return false just in case.
        return false;
      };

      /**
       * _forceRemove
       *
       * @param  {Node} node a DOM node
       */
      var _forceRemove = function _forceRemove(node) {
        arrayPush(DOMPurify.removed, { element: node });
        try {
          // eslint-disable-next-line unicorn/prefer-dom-node-remove
          node.parentNode.removeChild(node);
        } catch (_) {
          try {
            node.outerHTML = emptyHTML;
          } catch (_) {
            node.remove();
          }
        }
      };

      /**
       * _removeAttribute
       *
       * @param  {String} name an Attribute name
       * @param  {Node} node a DOM node
       */
      var _removeAttribute = function _removeAttribute(name, node) {
        try {
          arrayPush(DOMPurify.removed, {
            attribute: node.getAttributeNode(name),
            from: node
          });
        } catch (_) {
          arrayPush(DOMPurify.removed, {
            attribute: null,
            from: node
          });
        }

        node.removeAttribute(name);

        // We void attribute values for unremovable "is"" attributes
        if (name === 'is' && !ALLOWED_ATTR[name]) {
          if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
            try {
              _forceRemove(node);
            } catch (_) {}
          } else {
            try {
              node.setAttribute(name, '');
            } catch (_) {}
          }
        }
      };

      /**
       * _initDocument
       *
       * @param  {String} dirty a string of dirty markup
       * @return {Document} a DOM, filled with the dirty markup
       */
      var _initDocument = function _initDocument(dirty) {
        /* Create a HTML document */
        var doc = void 0;
        var leadingWhitespace = void 0;

        if (FORCE_BODY) {
          dirty = '<remove></remove>' + dirty;
        } else {
          /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
          var matches = stringMatch(dirty, /^[\r\n\t ]+/);
          leadingWhitespace = matches && matches[0];
        }

        var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
        /*
         * Use the DOMParser API by default, fallback later if needs be
         * DOMParser not work for svg when has multiple root element.
         */
        if (NAMESPACE === HTML_NAMESPACE) {
          try {
            doc = new DOMParser().parseFromString(dirtyPayload, 'text/html');
          } catch (_) {}
        }

        /* Use createHTMLDocument in case DOMParser is not available */
        if (!doc || !doc.documentElement) {
          doc = implementation.createDocument(NAMESPACE, 'template', null);
          try {
            doc.documentElement.innerHTML = IS_EMPTY_INPUT ? '' : dirtyPayload;
          } catch (_) {
            // Syntax error if dirtyPayload is invalid xml
          }
        }

        var body = doc.body || doc.documentElement;

        if (dirty && leadingWhitespace) {
          body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
        }

        /* Work on whole document or just its body */
        if (NAMESPACE === HTML_NAMESPACE) {
          return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
        }

        return WHOLE_DOCUMENT ? doc.documentElement : body;
      };

      /**
       * _createIterator
       *
       * @param  {Document} root document/fragment to create iterator for
       * @return {Iterator} iterator instance
       */
      var _createIterator = function _createIterator(root) {
        return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, null, false);
      };

      /**
       * _isClobbered
       *
       * @param  {Node} elm element to check for clobbering attacks
       * @return {Boolean} true if clobbered, false if safe
       */
      var _isClobbered = function _isClobbered(elm) {
        if (elm instanceof Text || elm instanceof Comment) {
          return false;
        }

        if (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function') {
          return true;
        }

        return false;
      };

      /**
       * _isNode
       *
       * @param  {Node} obj object to check whether it's a DOM node
       * @return {Boolean} true is object is a DOM node
       */
      var _isNode = function _isNode(object) {
        return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? object instanceof Node : object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
      };

      /**
       * _executeHook
       * Execute user configurable hooks
       *
       * @param  {String} entryPoint  Name of the hook's entry point
       * @param  {Node} currentNode node to work on with the hook
       * @param  {Object} data additional hook parameters
       */
      var _executeHook = function _executeHook(entryPoint, currentNode, data) {
        if (!hooks[entryPoint]) {
          return;
        }

        arrayForEach(hooks[entryPoint], function (hook) {
          hook.call(DOMPurify, currentNode, data, CONFIG);
        });
      };

      /**
       * _sanitizeElements
       *
       * @protect nodeName
       * @protect textContent
       * @protect removeChild
       *
       * @param   {Node} currentNode to check for permission to exist
       * @return  {Boolean} true if node was killed, false if left alive
       */
      var _sanitizeElements = function _sanitizeElements(currentNode) {
        var content = void 0;

        /* Execute a hook if present */
        _executeHook('beforeSanitizeElements', currentNode, null);

        /* Check if element is clobbered or can clobber */
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
          return true;
        }

        /* Check if tagname contains Unicode */
        if (stringMatch(currentNode.nodeName, /[\u0080-\uFFFF]/)) {
          _forceRemove(currentNode);
          return true;
        }

        /* Now let's check the element's type and name */
        var tagName = stringToLowerCase(currentNode.nodeName);

        /* Execute a hook if present */
        _executeHook('uponSanitizeElement', currentNode, {
          tagName: tagName,
          allowedTags: ALLOWED_TAGS
        });

        /* Detect mXSS attempts abusing namespace confusion */
        if (!_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
          _forceRemove(currentNode);
          return true;
        }

        /* Remove element if anything forbids its presence */
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          /* Keep content except for bad-listed elements */
          if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
            var parentNode = getParentNode(currentNode) || currentNode.parentNode;
            var childNodes = getChildNodes(currentNode) || currentNode.childNodes;

            if (childNodes && parentNode) {
              var childCount = childNodes.length;

              for (var i = childCount - 1; i >= 0; --i) {
                parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
              }
            }
          }

          _forceRemove(currentNode);
          return true;
        }

        /* Check whether element has a valid namespace */
        if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
          _forceRemove(currentNode);
          return true;
        }

        if ((tagName === 'noscript' || tagName === 'noembed') && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
          _forceRemove(currentNode);
          return true;
        }

        /* Sanitize element content to be template-safe */
        if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
          /* Get the element's text content */
          content = currentNode.textContent;
          content = stringReplace(content, MUSTACHE_EXPR$$1, ' ');
          content = stringReplace(content, ERB_EXPR$$1, ' ');
          if (currentNode.textContent !== content) {
            arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
            currentNode.textContent = content;
          }
        }

        /* Execute a hook if present */
        _executeHook('afterSanitizeElements', currentNode, null);

        return false;
      };

      /**
       * _isValidAttribute
       *
       * @param  {string} lcTag Lowercase tag name of containing element.
       * @param  {string} lcName Lowercase attribute name.
       * @param  {string} value Attribute value.
       * @return {Boolean} Returns true if `value` is valid, otherwise false.
       */
      // eslint-disable-next-line complexity
      var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
        /* Make sure attribute cannot clobber */
        if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
          return false;
        }

        /* Allow valid data-* attributes: At least one character after "-"
            (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
            XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
            We don't need to check the value; it's always URI safe. */
        if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
          return false;

          /* Check value is safe. First, is attr inert? If so, is safe */
        } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if (!value) ; else {
          return false;
        }

        return true;
      };

      /**
       * _sanitizeAttributes
       *
       * @protect attributes
       * @protect nodeName
       * @protect removeAttribute
       * @protect setAttribute
       *
       * @param  {Node} currentNode to sanitize
       */
      var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
        var attr = void 0;
        var value = void 0;
        var lcName = void 0;
        var l = void 0;
        /* Execute a hook if present */
        _executeHook('beforeSanitizeAttributes', currentNode, null);

        var attributes = currentNode.attributes;

        /* Check if we have attributes; if not we might have a text node */

        if (!attributes) {
          return;
        }

        var hookEvent = {
          attrName: '',
          attrValue: '',
          keepAttr: true,
          allowedAttributes: ALLOWED_ATTR
        };
        l = attributes.length;

        /* Go backwards over all attributes; safely remove bad ones */
        while (l--) {
          attr = attributes[l];
          var _attr = attr,
              name = _attr.name,
              namespaceURI = _attr.namespaceURI;

          value = stringTrim(attr.value);
          lcName = stringToLowerCase(name);

          /* Execute a hook if present */
          hookEvent.attrName = lcName;
          hookEvent.attrValue = value;
          hookEvent.keepAttr = true;
          hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
          _executeHook('uponSanitizeAttribute', currentNode, hookEvent);
          value = hookEvent.attrValue;
          /* Did the hooks approve of the attribute? */
          if (hookEvent.forceKeepAttr) {
            continue;
          }

          /* Remove attribute */
          _removeAttribute(name, currentNode);

          /* Did the hooks approve of the attribute? */
          if (!hookEvent.keepAttr) {
            continue;
          }

          /* Work around a security issue in jQuery 3.0 */
          if (regExpTest(/\/>/i, value)) {
            _removeAttribute(name, currentNode);
            continue;
          }

          /* Sanitize attribute content to be template-safe */
          if (SAFE_FOR_TEMPLATES) {
            value = stringReplace(value, MUSTACHE_EXPR$$1, ' ');
            value = stringReplace(value, ERB_EXPR$$1, ' ');
          }

          /* Is `value` valid for this attribute? */
          var lcTag = currentNode.nodeName.toLowerCase();
          if (!_isValidAttribute(lcTag, lcName, value)) {
            continue;
          }

          /* Handle invalid data-* attribute set by try-catching it */
          try {
            if (namespaceURI) {
              currentNode.setAttributeNS(namespaceURI, name, value);
            } else {
              /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
              currentNode.setAttribute(name, value);
            }

            arrayPop(DOMPurify.removed);
          } catch (_) {}
        }

        /* Execute a hook if present */
        _executeHook('afterSanitizeAttributes', currentNode, null);
      };

      /**
       * _sanitizeShadowDOM
       *
       * @param  {DocumentFragment} fragment to iterate over recursively
       */
      var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
        var shadowNode = void 0;
        var shadowIterator = _createIterator(fragment);

        /* Execute a hook if present */
        _executeHook('beforeSanitizeShadowDOM', fragment, null);

        while (shadowNode = shadowIterator.nextNode()) {
          /* Execute a hook if present */
          _executeHook('uponSanitizeShadowNode', shadowNode, null);

          /* Sanitize tags and elements */
          if (_sanitizeElements(shadowNode)) {
            continue;
          }

          /* Deep shadow DOM detected */
          if (shadowNode.content instanceof DocumentFragment) {
            _sanitizeShadowDOM(shadowNode.content);
          }

          /* Check attributes, sanitize if necessary */
          _sanitizeAttributes(shadowNode);
        }

        /* Execute a hook if present */
        _executeHook('afterSanitizeShadowDOM', fragment, null);
      };

      /**
       * Sanitize
       * Public method providing core sanitation functionality
       *
       * @param {String|Node} dirty string or DOM node
       * @param {Object} configuration object
       */
      // eslint-disable-next-line complexity
      DOMPurify.sanitize = function (dirty, cfg) {
        var body = void 0;
        var importedNode = void 0;
        var currentNode = void 0;
        var oldNode = void 0;
        var returnNode = void 0;
        /* Make sure we have a string to sanitize.
          DO NOT return early, as this will return the wrong type if
          the user has requested a DOM object rather than a string */
        IS_EMPTY_INPUT = !dirty;
        if (IS_EMPTY_INPUT) {
          dirty = '<!-->';
        }

        /* Stringify, in case dirty is an object */
        if (typeof dirty !== 'string' && !_isNode(dirty)) {
          // eslint-disable-next-line no-negated-condition
          if (typeof dirty.toString !== 'function') {
            throw typeErrorCreate('toString is not a function');
          } else {
            dirty = dirty.toString();
            if (typeof dirty !== 'string') {
              throw typeErrorCreate('dirty is not a string, aborting');
            }
          }
        }

        /* Check we can run. Otherwise fall back or ignore */
        if (!DOMPurify.isSupported) {
          if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
            if (typeof dirty === 'string') {
              return window.toStaticHTML(dirty);
            }

            if (_isNode(dirty)) {
              return window.toStaticHTML(dirty.outerHTML);
            }
          }

          return dirty;
        }

        /* Assign config vars */
        if (!SET_CONFIG) {
          _parseConfig(cfg);
        }

        /* Clean up removed elements */
        DOMPurify.removed = [];

        /* Check if dirty is correctly typed for IN_PLACE */
        if (typeof dirty === 'string') {
          IN_PLACE = false;
        }

        if (IN_PLACE) ; else if (dirty instanceof Node) {
          /* If dirty is a DOM element, append to an empty document to avoid
             elements being stripped by the parser */
          body = _initDocument('<!---->');
          importedNode = body.ownerDocument.importNode(dirty, true);
          if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
            /* Node is already a body, use as is */
            body = importedNode;
          } else if (importedNode.nodeName === 'HTML') {
            body = importedNode;
          } else {
            // eslint-disable-next-line unicorn/prefer-dom-node-append
            body.appendChild(importedNode);
          }
        } else {
          /* Exit directly if we have nothing to do */
          if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
          // eslint-disable-next-line unicorn/prefer-includes
          dirty.indexOf('<') === -1) {
            return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
          }

          /* Initialize the document to work on */
          body = _initDocument(dirty);

          /* Check we have a DOM node from the data */
          if (!body) {
            return RETURN_DOM ? null : emptyHTML;
          }
        }

        /* Remove first element node (ours) if FORCE_BODY is set */
        if (body && FORCE_BODY) {
          _forceRemove(body.firstChild);
        }

        /* Get node iterator */
        var nodeIterator = _createIterator(IN_PLACE ? dirty : body);

        /* Now start iterating over the created document */
        while (currentNode = nodeIterator.nextNode()) {
          /* Fix IE's strange behavior with manipulated textNodes #89 */
          if (currentNode.nodeType === 3 && currentNode === oldNode) {
            continue;
          }

          /* Sanitize tags and elements */
          if (_sanitizeElements(currentNode)) {
            continue;
          }

          /* Shadow DOM detected, sanitize it */
          if (currentNode.content instanceof DocumentFragment) {
            _sanitizeShadowDOM(currentNode.content);
          }

          /* Check attributes, sanitize if necessary */
          _sanitizeAttributes(currentNode);

          oldNode = currentNode;
        }

        oldNode = null;

        /* If we sanitized `dirty` in-place, return it. */
        if (IN_PLACE) {
          return dirty;
        }

        /* Return sanitized string or DOM */
        if (RETURN_DOM) {
          if (RETURN_DOM_FRAGMENT) {
            returnNode = createDocumentFragment.call(body.ownerDocument);

            while (body.firstChild) {
              // eslint-disable-next-line unicorn/prefer-dom-node-append
              returnNode.appendChild(body.firstChild);
            }
          } else {
            returnNode = body;
          }

          if (RETURN_DOM_IMPORT) {
            /*
              AdoptNode() is not used because internal state is not reset
              (e.g. the past names map of a HTMLFormElement), this is safe
              in theory but we would rather not risk another attack vector.
              The state that is cloned by importNode() is explicitly defined
              by the specs.
            */
            returnNode = importNode.call(originalDocument, returnNode, true);
          }

          return returnNode;
        }

        var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;

        /* Sanitize final string template-safe */
        if (SAFE_FOR_TEMPLATES) {
          serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, ' ');
          serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, ' ');
        }

        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
      };

      /**
       * Public method to set the configuration once
       * setConfig
       *
       * @param {Object} cfg configuration object
       */
      DOMPurify.setConfig = function (cfg) {
        _parseConfig(cfg);
        SET_CONFIG = true;
      };

      /**
       * Public method to remove the configuration
       * clearConfig
       *
       */
      DOMPurify.clearConfig = function () {
        CONFIG = null;
        SET_CONFIG = false;
      };

      /**
       * Public method to check if an attribute value is valid.
       * Uses last set config, if any. Otherwise, uses config defaults.
       * isValidAttribute
       *
       * @param  {string} tag Tag name of containing element.
       * @param  {string} attr Attribute name.
       * @param  {string} value Attribute value.
       * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
       */
      DOMPurify.isValidAttribute = function (tag, attr, value) {
        /* Initialize shared config vars if necessary. */
        if (!CONFIG) {
          _parseConfig({});
        }

        var lcTag = stringToLowerCase(tag);
        var lcName = stringToLowerCase(attr);
        return _isValidAttribute(lcTag, lcName, value);
      };

      /**
       * AddHook
       * Public method to add DOMPurify hooks
       *
       * @param {String} entryPoint entry point for the hook to add
       * @param {Function} hookFunction function to execute
       */
      DOMPurify.addHook = function (entryPoint, hookFunction) {
        if (typeof hookFunction !== 'function') {
          return;
        }

        hooks[entryPoint] = hooks[entryPoint] || [];
        arrayPush(hooks[entryPoint], hookFunction);
      };

      /**
       * RemoveHook
       * Public method to remove a DOMPurify hook at a given entryPoint
       * (pops it from the stack of hooks if more are present)
       *
       * @param {String} entryPoint entry point for the hook to remove
       */
      DOMPurify.removeHook = function (entryPoint) {
        if (hooks[entryPoint]) {
          arrayPop(hooks[entryPoint]);
        }
      };

      /**
       * RemoveHooks
       * Public method to remove all DOMPurify hooks at a given entryPoint
       *
       * @param  {String} entryPoint entry point for the hooks to remove
       */
      DOMPurify.removeHooks = function (entryPoint) {
        if (hooks[entryPoint]) {
          hooks[entryPoint] = [];
        }
      };

      /**
       * RemoveAllHooks
       * Public method to remove all DOMPurify hooks
       *
       */
      DOMPurify.removeAllHooks = function () {
        hooks = {};
      };

      return DOMPurify;
    }

    var purify = createDOMPurify();

    var minIndent$1 = string => {
    	const match = string.match(/^[ \t]*(?=\S)/gm);

    	if (!match) {
    		return 0;
    	}

    	return match.reduce((r, a) => Math.min(r, a.length), Infinity);
    };

    const minIndent = minIndent$1;

    var stripIndent = string => {
    	const indent = minIndent(string);

    	if (indent === 0) {
    		return string;
    	}

    	const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm');

    	return string.replace(regex, '');
    };

    // Gets all non-builtin properties up the prototype chain
    const getAllProperties = object => {
    	const properties = new Set();

    	do {
    		for (const key of Reflect.ownKeys(object)) {
    			properties.add([object, key]);
    		}
    	} while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

    	return properties;
    };

    var autoBind = (self, {include, exclude} = {}) => {
    	const filter = key => {
    		const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);

    		if (include) {
    			return include.some(match);
    		}

    		if (exclude) {
    			return !exclude.some(match);
    		}

    		return true;
    	};

    	for (const [object, key] of getAllProperties(self.constructor.prototype)) {
    		if (key === 'constructor' || !filter(key)) {
    			continue;
    		}

    		const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    		if (descriptor && typeof descriptor.value === 'function') {
    			self[key] = self[key].bind(self);
    		}
    	}

    	return self;
    };

    function isEqual(a1, a2) {
        return JSON.stringify(a1) === JSON.stringify(a2);
    }
    function shuffle(array, n) {
        // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array.slice(0, n);
    }
    class BaseQuestion {
        constructor(text, explanation, hint, answers, questionType, options) {
            if (answers.length === 0) {
                throw 'no answers for question provided';
            }
            this.text = text;
            this.explanation = explanation;
            this.hint = hint;
            this.solved = false;
            this.showHint = writable(false);
            this.options = options;
            this.answers = answers;
            this.questionType = questionType;
            this.visited = false;
            autoBind(this);
            this.reset();
        }
        enableHint() {
            this.showHint.update((val) => true);
        }
        reset() {
            this.selected = [];
            this.solved = false;
            this.visited = false;
            this.showHint.set(false);
            if (this.options.shuffleAnswers) {
                this.answers = shuffle(this.answers, this.answers.length);
            }
        }
    }
    class Sequence extends BaseQuestion {
        constructor(text, explanation, hint, answers, options) {
            // always enable shuffling for sequence questions
            options.shuffleAnswers = true;
            super(text, explanation, hint, answers, 'Sequence', options);
        }
        isCorrect() {
            // extract answer ids from answers
            let trueAnswerIds = this.answers.map((answer) => answer.id);
            this.solved = isEqual(trueAnswerIds.sort(), this.selected);
            return this.solved;
        }
    }
    class Choice extends BaseQuestion {
        isCorrect() {
            let trueAnswerIds = this.answers
                .filter((answer) => answer.correct)
                .map((answer) => answer.id);
            let selectedAnswerIds = this.selected.map((i) => this.answers[i].id);
            this.solved = isEqual(trueAnswerIds.sort(), selectedAnswerIds.sort());
            return this.solved;
        }
    }
    class MultipleChoice extends Choice {
        constructor(text, explanation, hint, answers, options) {
            super(text, explanation, hint, answers, 'MultipleChoice', options);
        }
    }
    class SingleChoice extends Choice {
        constructor(text, explanation, hint, answers, options) {
            super(text, explanation, hint, answers, 'SingleChoice', options);
            let nCorrect = this.answers.filter((answer) => answer.correct).length;
            if (nCorrect > 1) {
                throw 'Single Choice questions can not have more than one correct answer.';
            }
        }
    }
    class Answer {
        constructor(id, html, correct, comment) {
            this.html = html;
            this.correct = correct;
            this.id = id;
            this.comment = comment;
            autoBind(this);
        }
    }
    class Quiz {
        constructor(questions, config) {
            this.index = writable(0);
            this.questions = questions;
            this.config = config;
            if (this.config.shuffleQuestions) {
                this.questions = shuffle(this.questions, this.config.nQuestions);
            }
            if (this.questions.length == 0) {
                throw 'No questions for quiz provided';
            }
            // setup first question
            this.active = writable(this.questions[0]);
            this.questions[0].visited = true;
            this.onLast = writable(this.questions.length == 1);
            this.onResults = writable(false);
            this.onFirst = writable(true);
            this.allVisited = writable(this.questions.length == 1);
            this.isEvaluated = writable(false);
            autoBind(this);
        }
        setActive() {
            let idx = get_store_value(this.index);
            this.active.update((act) => this.questions[idx]);
            this.questions[idx].visited = true;
        }
        checkAllVisited() {
            for (let question of this.questions) {
                if (!question.visited) {
                    return false;
                }
            }
            return true;
        }
        jump(index) {
            if (index <= this.questions.length - 1 && index >= 0) {
                // on a question
                this.index.set(index);
                this.setActive();
                this.allVisited.set(this.checkAllVisited());
                this.onResults.set(false);
                this.onLast.set(index == this.questions.length - 1);
                this.onFirst.set(index == 0);
                return true;
            }
            else if (index == this.questions.length) {
                // on results page
                this.onResults.set(true);
                this.onLast.set(false);
                this.index.set(index);
                return true;
            }
            else {
                return false;
            }
        }
        next() {
            return this.jump(get_store_value(this.index) + 1);
        }
        previous() {
            return this.jump(get_store_value(this.index) - 1);
        }
        reset() {
            this.onLast.set(false);
            this.onResults.set(false);
            this.allVisited.set(false);
            this.isEvaluated.set(false);
            this.questions.forEach((q) => q.reset());
            return this.jump(0);
        }
        evaluate() {
            var points = 0;
            for (var q of this.questions) {
                if (q.isCorrect()) {
                    points += 1;
                }
            }
            this.isEvaluated.set(true);
            const quizScore = {
                name: this.getQuizName(),
                score: points,
                maxScore: this.questions.length
            };
            this.storeScoreInBrowser(quizScore);
            return points;
        }
        getQuizName() {
            return window.document.getElementsByTagName("h1")[0].textContent;
        }
        storeScoreInBrowser(quizScore) {
            window.localStorage.setItem(quizScore.name + '.score', quizScore.score.toString());
            window.localStorage.setItem(quizScore.name + '.maxScore', quizScore.maxScore.toString());
        }
    }

    function get(attr, def) {
        return typeof attr != 'undefined' ? attr : def;
    }
    function renameProp(oldprop, newprop, obj) {
        if (oldprop in obj) {
            obj[newprop] = obj[oldprop];
        }
    }
    const toRename = {
        start_on_load: 'startOnLoad',
        shuffle_answers: 'shuffleAnswers',
        shuffle_questions: 'shuffleQuestions',
        primary_color: 'primaryColor',
        secondary_color: 'secondaryColor',
        text_color: 'textColor',
    };
    class Config {
        constructor(options) {
            // handle <=v0.3.0 snake_case options for backwards compatibility
            for (const oldName in toRename) {
                renameProp(oldName, toRename[oldName], options);
            }
            this.startOnLoad = get(options['startOnLoad'], true);
            this.shuffleAnswers = get(options['shuffleAnswers'], true);
            this.shuffleQuestions = get(options['shuffleQuestions'], false);
            this.nQuestions = get(options['nQuestions'], undefined);
            this.primaryColor = get(options['primaryColor'], 'steelblue');
            this.secondaryColor = get(options['secondaryColor'], '#f2f2f2');
            this.textColor = get(options['textColor'], 'black');
            this.locale = get(options['locale'], null);
        }
    }
    function mergeAttributes(baseConfig, newConfig) {
        //newConfig overwrites entries in baseConfig
        let config = new Config(baseConfig);
        for (let attrname in newConfig) {
            if (Object.prototype.hasOwnProperty.call(newConfig, attrname)) {
                config[attrname] = newConfig[attrname];
            }
        }
        return config;
    }

    var defaults$5 = {exports: {}};

    function getDefaults$1() {
      return {
        baseUrl: null,
        breaks: false,
        extensions: null,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }

    function changeDefaults$1(newDefaults) {
      defaults$5.exports.defaults = newDefaults;
    }

    defaults$5.exports = {
      defaults: getDefaults$1(),
      getDefaults: getDefaults$1,
      changeDefaults: changeDefaults$1
    };

    /**
     * Helpers
     */

    const escapeTest = /[&<>"']/;
    const escapeReplace = /[&<>"']/g;
    const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    const getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape$3(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }

      return html;
    }

    const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

    function unescape$1(html) {
      // explicitly match decimal, hex, and named HTML entities
      return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
          return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
        }
        return '';
      });
    }

    const caret = /(^|[^\[])\^/g;
    function edit$1(regex, opt) {
      regex = regex.source || regex;
      opt = opt || '';
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, '$1');
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }

    const nonWordAndColonTest = /[^\w:]/g;
    const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    function cleanUrl$1(sanitize, base, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape$1(href))
            .replace(nonWordAndColonTest, '')
            .toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, '%');
      } catch (e) {
        return null;
      }
      return href;
    }

    const baseUrls = {};
    const justDomain = /^[^:]+:\/*[^/]*$/;
    const protocol = /^([^:]+:)[\s\S]*$/;
    const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

    function resolveUrl(base, href) {
      if (!baseUrls[' ' + base]) {
        // we can ignore everything in base after the last slash of its path component,
        // but we might need to add _that_
        // https://tools.ietf.org/html/rfc3986#section-3
        if (justDomain.test(base)) {
          baseUrls[' ' + base] = base + '/';
        } else {
          baseUrls[' ' + base] = rtrim$1(base, '/', true);
        }
      }
      base = baseUrls[' ' + base];
      const relativeBase = base.indexOf(':') === -1;

      if (href.substring(0, 2) === '//') {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, '$1') + href;
      } else if (href.charAt(0) === '/') {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain, '$1') + href;
      } else {
        return base + href;
      }
    }

    const noopTest$1 = { exec: function noopTest() {} };

    function merge$2(obj) {
      let i = 1,
        target,
        key;

      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }

      return obj;
    }

    function splitCells$1(tableRow, count) {
      // ensure that every cell-delimiting pipe has a space
      // before it to distinguish it from an escaped pipe
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped = false,
            curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/);
      let i = 0;

      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push('');
      }

      for (; i < cells.length; i++) {
        // leading or trailing whitespace is ignored per the gfm spec
        cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
    }

    // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
    // /c*$/ is vulnerable to REDOS.
    // invert: Remove suffix of non-c chars instead. Default falsey.
    function rtrim$1(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return '';
      }

      // Length of suffix matching the invert condition.
      let suffLen = 0;

      // Step left until we fail to match the invert condition.
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }

      return str.substr(0, l - suffLen);
    }

    function findClosingBracket$1(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0,
        i = 0;
      for (; i < l; i++) {
        if (str[i] === '\\') {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }

    function checkSanitizeDeprecation$1(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
      }
    }

    // copied from https://stackoverflow.com/a/5450113/806777
    function repeatString$1(pattern, count) {
      if (count < 1) {
        return '';
      }
      let result = '';
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }

    var helpers = {
      escape: escape$3,
      unescape: unescape$1,
      edit: edit$1,
      cleanUrl: cleanUrl$1,
      resolveUrl,
      noopTest: noopTest$1,
      merge: merge$2,
      splitCells: splitCells$1,
      rtrim: rtrim$1,
      findClosingBracket: findClosingBracket$1,
      checkSanitizeDeprecation: checkSanitizeDeprecation$1,
      repeatString: repeatString$1
    };

    const { defaults: defaults$4 } = defaults$5.exports;
    const {
      rtrim,
      splitCells,
      escape: escape$2,
      findClosingBracket
    } = helpers;

    function outputLink(cap, link, raw) {
      const href = link.href;
      const title = link.title ? escape$2(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, '$1');

      if (cap[0].charAt(0) !== '!') {
        return {
          type: 'link',
          raw,
          href,
          title,
          text
        };
      } else {
        return {
          type: 'image',
          raw,
          href,
          title,
          text: escape$2(text)
        };
      }
    }

    function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

      if (matchIndentToCode === null) {
        return text;
      }

      const indentToCode = matchIndentToCode[1];

      return text
        .split('\n')
        .map(node => {
          const matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
            return node;
          }

          const [indentInNode] = matchIndentInNode;

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        })
        .join('\n');
    }

    /**
     * Tokenizer
     */
    var Tokenizer_1 = class Tokenizer {
      constructor(options) {
        this.options = options || defaults$4;
      }

      space(src) {
        const cap = this.rules.block.newline.exec(src);
        if (cap) {
          if (cap[0].length > 1) {
            return {
              type: 'space',
              raw: cap[0]
            };
          }
          return { raw: '\n' };
        }
      }

      code(src) {
        const cap = this.rules.block.code.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ {1,4}/gm, '');
          return {
            type: 'code',
            raw: cap[0],
            codeBlockStyle: 'indented',
            text: !this.options.pedantic
              ? rtrim(text, '\n')
              : text
          };
        }
      }

      fences(src) {
        const cap = this.rules.block.fences.exec(src);
        if (cap) {
          const raw = cap[0];
          const text = indentCodeCompensation(raw, cap[3] || '');

          return {
            type: 'code',
            raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text
          };
        }
      }

      heading(src) {
        const cap = this.rules.block.heading.exec(src);
        if (cap) {
          let text = cap[2].trim();

          // remove trailing #s
          if (/#$/.test(text)) {
            const trimmed = rtrim(text, '#');
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              // CommonMark requires space before trailing #s
              text = trimmed.trim();
            }
          }

          return {
            type: 'heading',
            raw: cap[0],
            depth: cap[1].length,
            text: text
          };
        }
      }

      nptable(src) {
        const cap = this.rules.block.nptable.exec(src);
        if (cap) {
          const item = {
            type: 'table',
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [],
            raw: cap[0]
          };

          if (item.header.length === item.align.length) {
            let l = item.align.length;
            let i;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.cells.length;
            for (i = 0; i < l; i++) {
              item.cells[i] = splitCells(item.cells[i], item.header.length);
            }

            return item;
          }
        }
      }

      hr(src) {
        const cap = this.rules.block.hr.exec(src);
        if (cap) {
          return {
            type: 'hr',
            raw: cap[0]
          };
        }
      }

      blockquote(src) {
        const cap = this.rules.block.blockquote.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ *> ?/gm, '');

          return {
            type: 'blockquote',
            raw: cap[0],
            text
          };
        }
      }

      list(src) {
        const cap = this.rules.block.list.exec(src);
        if (cap) {
          let raw = cap[0];
          const bull = cap[2];
          const isordered = bull.length > 1;

          const list = {
            type: 'list',
            raw,
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : '',
            loose: false,
            items: []
          };

          // Get each top-level item.
          const itemMatch = cap[0].match(this.rules.block.item);

          let next = false,
            item,
            space,
            bcurr,
            bnext,
            addBack,
            loose,
            istask,
            ischecked,
            endMatch;

          let l = itemMatch.length;
          bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);
          for (let i = 0; i < l; i++) {
            item = itemMatch[i];
            raw = item;

            if (!this.options.pedantic) {
              // Determine if current item contains the end of the list
              endMatch = item.match(new RegExp('\\n\\s*\\n {0,' + (bcurr[0].length - 1) + '}\\S'));
              if (endMatch) {
                addBack = item.length - endMatch.index + itemMatch.slice(i + 1).join('\n').length;
                list.raw = list.raw.substring(0, list.raw.length - addBack);

                item = item.substring(0, endMatch.index);
                raw = item;
                l = i + 1;
              }
            }

            // Determine whether the next list item belongs here.
            // Backpedal if it does not belong in this list.
            if (i !== l - 1) {
              bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);
              if (
                !this.options.pedantic
                  ? bnext[1].length >= bcurr[0].length || bnext[1].length > 3
                  : bnext[1].length > bcurr[1].length
              ) {
                // nested list or continuation
                itemMatch.splice(i, 2, itemMatch[i] + (!this.options.pedantic && bnext[1].length < bcurr[0].length && !itemMatch[i].match(/\n$/) ? '' : '\n') + itemMatch[i + 1]);
                i--;
                l--;
                continue;
              } else if (
                // different bullet style
                !this.options.pedantic || this.options.smartLists
                  ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1]
                  : isordered === (bnext[2].length === 1)
              ) {
                addBack = itemMatch.slice(i + 1).join('\n').length;
                list.raw = list.raw.substring(0, list.raw.length - addBack);
                i = l - 1;
              }
              bcurr = bnext;
            }

            // Remove the list item's bullet
            // so it is seen as the next token.
            space = item.length;
            item = item.replace(/^ *([*+-]|\d+[.)]) ?/, '');

            // Outdent whatever the
            // list item contains. Hacky.
            if (~item.indexOf('\n ')) {
              space -= item.length;
              item = !this.options.pedantic
                ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
                : item.replace(/^ {1,4}/gm, '');
            }

            // trim item newlines at end
            item = rtrim(item, '\n');
            if (i !== l - 1) {
              raw = raw + '\n';
            }

            // Determine whether item is loose or not.
            // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
            // for discount behavior.
            loose = next || /\n\n(?!\s*$)/.test(raw);
            if (i !== l - 1) {
              next = raw.slice(-2) === '\n\n';
              if (!loose) loose = next;
            }

            if (loose) {
              list.loose = true;
            }

            // Check for task list items
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.test(item);
              ischecked = undefined;
              if (istask) {
                ischecked = item[1] !== ' ';
                item = item.replace(/^\[[ xX]\] +/, '');
              }
            }

            list.items.push({
              type: 'list_item',
              raw,
              task: istask,
              checked: ischecked,
              loose: loose,
              text: item
            });
          }

          return list;
        }
      }

      html(src) {
        const cap = this.rules.block.html.exec(src);
        if (cap) {
          return {
            type: this.options.sanitize
              ? 'paragraph'
              : 'html',
            raw: cap[0],
            pre: !this.options.sanitizer
              && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$2(cap[0])) : cap[0]
          };
        }
      }

      def(src) {
        const cap = this.rules.block.def.exec(src);
        if (cap) {
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          return {
            type: 'def',
            tag,
            raw: cap[0],
            href: cap[2],
            title: cap[3]
          };
        }
      }

      table(src) {
        const cap = this.rules.block.table.exec(src);
        if (cap) {
          const item = {
            type: 'table',
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
          };

          if (item.header.length === item.align.length) {
            item.raw = cap[0];

            let l = item.align.length;
            let i;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.cells.length;
            for (i = 0; i < l; i++) {
              item.cells[i] = splitCells(
                item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
                item.header.length);
            }

            return item;
          }
        }
      }

      lheading(src) {
        const cap = this.rules.block.lheading.exec(src);
        if (cap) {
          return {
            type: 'heading',
            raw: cap[0],
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1]
          };
        }
      }

      paragraph(src) {
        const cap = this.rules.block.paragraph.exec(src);
        if (cap) {
          return {
            type: 'paragraph',
            raw: cap[0],
            text: cap[1].charAt(cap[1].length - 1) === '\n'
              ? cap[1].slice(0, -1)
              : cap[1]
          };
        }
      }

      text(src) {
        const cap = this.rules.block.text.exec(src);
        if (cap) {
          return {
            type: 'text',
            raw: cap[0],
            text: cap[0]
          };
        }
      }

      escape(src) {
        const cap = this.rules.inline.escape.exec(src);
        if (cap) {
          return {
            type: 'escape',
            raw: cap[0],
            text: escape$2(cap[1])
          };
        }
      }

      tag(src, inLink, inRawBlock) {
        const cap = this.rules.inline.tag.exec(src);
        if (cap) {
          if (!inLink && /^<a /i.test(cap[0])) {
            inLink = true;
          } else if (inLink && /^<\/a>/i.test(cap[0])) {
            inLink = false;
          }
          if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            inRawBlock = true;
          } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            inRawBlock = false;
          }

          return {
            type: this.options.sanitize
              ? 'text'
              : 'html',
            raw: cap[0],
            inLink,
            inRawBlock,
            text: this.options.sanitize
              ? (this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape$2(cap[0]))
              : cap[0]
          };
        }
      }

      link(src) {
        const cap = this.rules.inline.link.exec(src);
        if (cap) {
          const trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            // commonmark requires matching angle brackets
            if (!(/>$/.test(trimmedUrl))) {
              return;
            }

            // ending angle bracket cannot be escaped
            const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            // find closing parenthesis
            const lastParenIndex = findClosingBracket(cap[2], '()');
            if (lastParenIndex > -1) {
              const start = cap[0].indexOf('!') === 0 ? 5 : 4;
              const linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
          }
          let href = cap[2];
          let title = '';
          if (this.options.pedantic) {
            // split pedantic href and title
            const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }

          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
              // pedantic allows starting angle bracket without ending angle bracket
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
            title: title ? title.replace(this.rules.inline._escapes, '$1') : title
          }, cap[0]);
        }
      }

      reflink(src, links) {
        let cap;
        if ((cap = this.rules.inline.reflink.exec(src))
            || (cap = this.rules.inline.nolink.exec(src))) {
          let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = links[link.toLowerCase()];
          if (!link || !link.href) {
            const text = cap[0].charAt(0);
            return {
              type: 'text',
              raw: text,
              text
            };
          }
          return outputLink(cap, link, cap[0]);
        }
      }

      emStrong(src, maskedSrc, prevChar = '') {
        let match = this.rules.inline.emStrong.lDelim.exec(src);
        if (!match) return;

        // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
        if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;

        const nextChar = match[1] || match[2] || '';

        if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
          const lLength = match[0].length - 1;
          let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

          const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
          endReg.lastIndex = 0;

          // Clip maskedSrc to same section of string as src (move to lexer?)
          maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

          while ((match = endReg.exec(maskedSrc)) != null) {
            rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

            if (!rDelim) continue; // skip single * in __abc*abc__

            rLength = rDelim.length;

            if (match[3] || match[4]) { // found another Left Delim
              delimTotal += rLength;
              continue;
            } else if (match[5] || match[6]) { // either Left or Right Delim
              if (lLength % 3 && !((lLength + rLength) % 3)) {
                midDelimTotal += rLength;
                continue; // CommonMark Emphasis Rules 9-10
              }
            }

            delimTotal -= rLength;

            if (delimTotal > 0) continue; // Haven't found enough closing delimiters

            // Remove extra characters. *a*** -> *a*
            rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

            // Create `em` if smallest delimiter has odd char count. *a***
            if (Math.min(lLength, rLength) % 2) {
              return {
                type: 'em',
                raw: src.slice(0, lLength + match.index + rLength + 1),
                text: src.slice(1, lLength + match.index + rLength)
              };
            }

            // Create 'strong' if smallest delimiter has even char count. **a***
            return {
              type: 'strong',
              raw: src.slice(0, lLength + match.index + rLength + 1),
              text: src.slice(2, lLength + match.index + rLength - 1)
            };
          }
        }
      }

      codespan(src) {
        const cap = this.rules.inline.code.exec(src);
        if (cap) {
          let text = cap[2].replace(/\n/g, ' ');
          const hasNonSpaceChars = /[^ ]/.test(text);
          const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = escape$2(text, true);
          return {
            type: 'codespan',
            raw: cap[0],
            text
          };
        }
      }

      br(src) {
        const cap = this.rules.inline.br.exec(src);
        if (cap) {
          return {
            type: 'br',
            raw: cap[0]
          };
        }
      }

      del(src) {
        const cap = this.rules.inline.del.exec(src);
        if (cap) {
          return {
            type: 'del',
            raw: cap[0],
            text: cap[2]
          };
        }
      }

      autolink(src, mangle) {
        const cap = this.rules.inline.autolink.exec(src);
        if (cap) {
          let text, href;
          if (cap[2] === '@') {
            text = escape$2(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = 'mailto:' + text;
          } else {
            text = escape$2(cap[1]);
            href = text;
          }

          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      url(src, mangle) {
        let cap;
        if (cap = this.rules.inline.url.exec(src)) {
          let text, href;
          if (cap[2] === '@') {
            text = escape$2(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = 'mailto:' + text;
          } else {
            // do extended autolink path validation
            let prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape$2(cap[0]);
            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }
          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      inlineText(src, inRawBlock, smartypants) {
        const cap = this.rules.inline.text.exec(src);
        if (cap) {
          let text;
          if (inRawBlock) {
            text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$2(cap[0])) : cap[0];
          } else {
            text = escape$2(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
          }
          return {
            type: 'text',
            raw: cap[0],
            text
          };
        }
      }
    };

    const {
      noopTest,
      edit,
      merge: merge$1
    } = helpers;

    /**
     * Block-Level Grammar
     */
    const block$1 = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
      html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
        + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
        + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
        + ')',
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      nptable: noopTest,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      // regex template, placeholders will be replaced according to different paragraph
      // interruption rules of commonmark and the original markdown spec:
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
      text: /^[^\n]+/
    };

    block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
    block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block$1.def = edit(block$1.def)
      .replace('label', block$1._label)
      .replace('title', block$1._title)
      .getRegex();

    block$1.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block$1.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
    block$1.item = edit(block$1.item, 'gm')
      .replace(/bull/g, block$1.bullet)
      .getRegex();

    block$1.listItemStart = edit(/^( *)(bull) */)
      .replace('bull', block$1.bullet)
      .getRegex();

    block$1.list = edit(block$1.list)
      .replace(/bull/g, block$1.bullet)
      .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
      .replace('def', '\\n+(?=' + block$1.def.source + ')')
      .getRegex();

    block$1._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
      + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
      + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
      + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
      + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
      + '|track|ul';
    block$1._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block$1.html = edit(block$1.html, 'i')
      .replace('comment', block$1._comment)
      .replace('tag', block$1._tag)
      .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
      .getRegex();

    block$1.paragraph = edit(block$1._paragraph)
      .replace('hr', block$1.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block$1._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();

    block$1.blockquote = edit(block$1.blockquote)
      .replace('paragraph', block$1.paragraph)
      .getRegex();

    /**
     * Normal Block Grammar
     */

    block$1.normal = merge$1({}, block$1);

    /**
     * GFM Block Grammar
     */

    block$1.gfm = merge$1({}, block$1.normal, {
      nptable: '^ *([^|\\n ].*\\|.*)\\n' // Header
        + ' {0,3}([-:]+ *\\|[-| :]*)' // Align
        + '(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)', // Cells
      table: '^ *\\|(.+)\\n' // Header
        + ' {0,3}\\|?( *[-:]+[-| :]*)' // Align
        + '(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
    });

    block$1.gfm.nptable = edit(block$1.gfm.nptable)
      .replace('hr', block$1.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    block$1.gfm.table = edit(block$1.gfm.table)
      .replace('hr', block$1.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    /**
     * Pedantic grammar (original John Gruber's loose markdown specification)
     */

    block$1.pedantic = merge$1({}, block$1.normal, {
      html: edit(
        '^ *(?:comment *(?:\\n|\\s*$)'
        + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
        .replace('comment', block$1._comment)
        .replace(/tag/g, '(?!(?:'
          + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
          + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
          + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest, // fences not supported
      paragraph: edit(block$1.normal._paragraph)
        .replace('hr', block$1.hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', block$1.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex()
    });

    /**
     * Inline-Level Grammar
     */
    const inline$1 = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: '^comment'
        + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
      nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
      reflinkSearch: 'reflink|nolink(?!\\()',
      emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
        //        () Skip other delimiter (1) #***                   (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
        rDelimAst: /\_\_[^_*]*?\*[^_*]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
        rDelimUnd: /\*\*[^_*]*?\_[^_*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\spunctuation])/
    };

    // list of punctuation marks from CommonMark spec
    // without * and _ to handle the different emphasis markers * and _
    inline$1._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
    inline$1.punctuation = edit(inline$1.punctuation).replace(/punctuation/g, inline$1._punctuation).getRegex();

    // sequences em should skip over [title](link), `code`, <html>
    inline$1.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
    inline$1.escapedEmSt = /\\\*|\\_/g;

    inline$1._comment = edit(block$1._comment).replace('(?:-->|$)', '-->').getRegex();

    inline$1.emStrong.lDelim = edit(inline$1.emStrong.lDelim)
      .replace(/punct/g, inline$1._punctuation)
      .getRegex();

    inline$1.emStrong.rDelimAst = edit(inline$1.emStrong.rDelimAst, 'g')
      .replace(/punct/g, inline$1._punctuation)
      .getRegex();

    inline$1.emStrong.rDelimUnd = edit(inline$1.emStrong.rDelimUnd, 'g')
      .replace(/punct/g, inline$1._punctuation)
      .getRegex();

    inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

    inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline$1._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline$1.autolink = edit(inline$1.autolink)
      .replace('scheme', inline$1._scheme)
      .replace('email', inline$1._email)
      .getRegex();

    inline$1._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

    inline$1.tag = edit(inline$1.tag)
      .replace('comment', inline$1._comment)
      .replace('attribute', inline$1._attribute)
      .getRegex();

    inline$1._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline$1._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

    inline$1.link = edit(inline$1.link)
      .replace('label', inline$1._label)
      .replace('href', inline$1._href)
      .replace('title', inline$1._title)
      .getRegex();

    inline$1.reflink = edit(inline$1.reflink)
      .replace('label', inline$1._label)
      .getRegex();

    inline$1.reflinkSearch = edit(inline$1.reflinkSearch, 'g')
      .replace('reflink', inline$1.reflink)
      .replace('nolink', inline$1.nolink)
      .getRegex();

    /**
     * Normal Inline Grammar
     */

    inline$1.normal = merge$1({}, inline$1);

    /**
     * Pedantic Inline Grammar
     */

    inline$1.pedantic = merge$1({}, inline$1.normal, {
      strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline$1._label)
        .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline$1._label)
        .getRegex()
    });

    /**
     * GFM Inline Grammar
     */

    inline$1.gfm = merge$1({}, inline$1.normal, {
      escape: edit(inline$1.escape).replace('])', '~|])').getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    });

    inline$1.gfm.url = edit(inline$1.gfm.url, 'i')
      .replace('email', inline$1.gfm._extended_email)
      .getRegex();
    /**
     * GFM + Line Breaks Inline Grammar
     */

    inline$1.breaks = merge$1({}, inline$1.gfm, {
      br: edit(inline$1.br).replace('{2,}', '*').getRegex(),
      text: edit(inline$1.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex()
    });

    var rules = {
      block: block$1,
      inline: inline$1
    };

    const Tokenizer$1 = Tokenizer_1;
    const { defaults: defaults$3 } = defaults$5.exports;
    const { block, inline } = rules;
    const { repeatString } = helpers;

    /**
     * smartypants text replacement
     */
    function smartypants(text) {
      return text
        // em-dashes
        .replace(/---/g, '\u2014')
        // en-dashes
        .replace(/--/g, '\u2013')
        // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        // closing singles & apostrophes
        .replace(/'/g, '\u2019')
        // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
        // closing doubles
        .replace(/"/g, '\u201d')
        // ellipses
        .replace(/\.{3}/g, '\u2026');
    }

    /**
     * mangle email addresses
     */
    function mangle(text) {
      let out = '',
        i,
        ch;

      const l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
      }

      return out;
    }

    /**
     * Block Lexer
     */
    var Lexer_1 = class Lexer {
      constructor(options) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || defaults$3;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer$1();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;

        const rules = {
          block: block.normal,
          inline: inline.normal
        };

        if (this.options.pedantic) {
          rules.block = block.pedantic;
          rules.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules.block = block.gfm;
          if (this.options.breaks) {
            rules.inline = inline.breaks;
          } else {
            rules.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules;
      }

      /**
       * Expose Rules
       */
      static get rules() {
        return {
          block,
          inline
        };
      }

      /**
       * Static Lex Method
       */
      static lex(src, options) {
        const lexer = new Lexer(options);
        return lexer.lex(src);
      }

      /**
       * Static Lex Inline Method
       */
      static lexInline(src, options) {
        const lexer = new Lexer(options);
        return lexer.inlineTokens(src);
      }

      /**
       * Preprocessing
       */
      lex(src) {
        src = src
          .replace(/\r\n|\r/g, '\n')
          .replace(/\t/g, '    ');

        this.blockTokens(src, this.tokens, true);

        this.inline(this.tokens);

        return this.tokens;
      }

      /**
       * Lexing
       */
      blockTokens(src, tokens = [], top = true) {
        if (this.options.pedantic) {
          src = src.replace(/^ +$/gm, '');
        }
        let token, i, l, lastToken, cutSrc, lastParagraphClipped;

        while (src) {
          if (this.options.extensions
            && this.options.extensions.block
            && this.options.extensions.block.some((extTokenizer) => {
              if (token = extTokenizer.call(this, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // newline
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);
            if (token.type) {
              tokens.push(token);
            }
            continue;
          }

          // code
          if (token = this.tokenizer.code(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            // An indented code block cannot interrupt a paragraph.
            if (lastToken && lastToken.type === 'paragraph') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // fences
          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // heading
          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // table no leading pipe (gfm)
          if (token = this.tokenizer.nptable(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // hr
          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // blockquote
          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            token.tokens = this.blockTokens(token.text, [], top);
            tokens.push(token);
            continue;
          }

          // list
          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            l = token.items.length;
            for (i = 0; i < l; i++) {
              token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
            }
            tokens.push(token);
            continue;
          }

          // html
          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // def
          if (top && (token = this.tokenizer.def(src))) {
            src = src.substring(token.raw.length);
            if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }
            continue;
          }

          // table (gfm)
          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // lheading
          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // top-level paragraph
          // prevent paragraph consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startBlock) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startBlock.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call(this, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (top && (token = this.tokenizer.paragraph(cutSrc))) {
            lastToken = tokens[tokens.length - 1];
            if (lastParagraphClipped && lastToken.type === 'paragraph') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
            } else {
              tokens.push(token);
            }
            lastParagraphClipped = (cutSrc.length !== src.length);
            src = src.substring(token.raw.length);
            continue;
          }

          // text
          if (token = this.tokenizer.text(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }

      inline(tokens) {
        let i,
          j,
          k,
          l2,
          row,
          token;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];
          switch (token.type) {
            case 'paragraph':
            case 'text':
            case 'heading': {
              token.tokens = [];
              this.inlineTokens(token.text, token.tokens);
              break;
            }
            case 'table': {
              token.tokens = {
                header: [],
                cells: []
              };

              // header
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                token.tokens.header[j] = [];
                this.inlineTokens(token.header[j], token.tokens.header[j]);
              }

              // cells
              l2 = token.cells.length;
              for (j = 0; j < l2; j++) {
                row = token.cells[j];
                token.tokens.cells[j] = [];
                for (k = 0; k < row.length; k++) {
                  token.tokens.cells[j][k] = [];
                  this.inlineTokens(row[k], token.tokens.cells[j][k]);
                }
              }

              break;
            }
            case 'blockquote': {
              this.inline(token.tokens);
              break;
            }
            case 'list': {
              l2 = token.items.length;
              for (j = 0; j < l2; j++) {
                this.inline(token.items[j].tokens);
              }
              break;
            }
          }
        }

        return tokens;
      }

      /**
       * Lexing/Compiling
       */
      inlineTokens(src, tokens = [], inLink = false, inRawBlock = false) {
        let token, lastToken, cutSrc;

        // String with links masked to avoid interference with em and strong
        let maskedSrc = src;
        let match;
        let keepPrevChar, prevChar;

        // Mask out reflinks
        if (this.tokens.links) {
          const links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        }
        // Mask out other blocks
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }

        // Mask out escaped em & strong delimiters
        while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
        }

        while (src) {
          if (!keepPrevChar) {
            prevChar = '';
          }
          keepPrevChar = false;

          // extensions
          if (this.options.extensions
            && this.options.extensions.inline
            && this.options.extensions.inline.some((extTokenizer) => {
              if (token = extTokenizer.call(this, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // escape
          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // tag
          if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
            src = src.substring(token.raw.length);
            inLink = token.inLink;
            inRawBlock = token.inRawBlock;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // link
          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);
            if (token.type === 'link') {
              token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
            }
            tokens.push(token);
            continue;
          }

          // reflink, nolink
          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (token.type === 'link') {
              token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
              tokens.push(token);
            } else if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // em & strong
          if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          }

          // code
          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // br
          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // del (gfm)
          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          }

          // autolink
          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // url (gfm)
          if (!inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // text
          // prevent inlineText consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startInline) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startInline.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call(this, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (token = this.tokenizer.inlineText(cutSrc, inRawBlock, smartypants)) {
            src = src.substring(token.raw.length);
            if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
              prevChar = token.raw.slice(-1);
            }
            keepPrevChar = true;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }
    };

    const { defaults: defaults$2 } = defaults$5.exports;
    const {
      cleanUrl,
      escape: escape$1
    } = helpers;

    /**
     * Renderer
     */
    var Renderer_1 = class Renderer {
      constructor(options) {
        this.options = options || defaults$2;
      }

      code(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
          return '<pre><code>'
            + (escaped ? code : escape$1(code, true))
            + '</code></pre>\n';
        }

        return '<pre><code class="'
          + this.options.langPrefix
          + escape$1(lang, true)
          + '">'
          + (escaped ? code : escape$1(code, true))
          + '</code></pre>\n';
      }

      blockquote(quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
      }

      html(html) {
        return html;
      }

      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return '<h'
            + level
            + ' id="'
            + this.options.headerPrefix
            + slugger.slug(raw)
            + '">'
            + text
            + '</h'
            + level
            + '>\n';
        }
        // ignore IDs
        return '<h' + level + '>' + text + '</h' + level + '>\n';
      }

      hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }

      list(body, ordered, start) {
        const type = ordered ? 'ol' : 'ul',
          startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }

      listitem(text) {
        return '<li>' + text + '</li>\n';
      }

      checkbox(checked) {
        return '<input '
          + (checked ? 'checked="" ' : '')
          + 'disabled="" type="checkbox"'
          + (this.options.xhtml ? ' /' : '')
          + '> ';
      }

      paragraph(text) {
        return '<p>' + text + '</p>\n';
      }

      table(header, body) {
        if (body) body = '<tbody>' + body + '</tbody>';

        return '<table>\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table>\n';
      }

      tablerow(content) {
        return '<tr>\n' + content + '</tr>\n';
      }

      tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? '<' + type + ' align="' + flags.align + '">'
          : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
      }

      // span level renderer
      strong(text) {
        return '<strong>' + text + '</strong>';
      }

      em(text) {
        return '<em>' + text + '</em>';
      }

      codespan(text) {
        return '<code>' + text + '</code>';
      }

      br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }

      del(text) {
        return '<del>' + text + '</del>';
      }

      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + escape$1(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
      }

      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }

        let out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
      }

      text(text) {
        return text;
      }
    };

    /**
     * TextRenderer
     * returns only the textual part of the token
     */

    var TextRenderer_1 = class TextRenderer {
      // no need for block level renderers
      strong(text) {
        return text;
      }

      em(text) {
        return text;
      }

      codespan(text) {
        return text;
      }

      del(text) {
        return text;
      }

      html(text) {
        return text;
      }

      text(text) {
        return text;
      }

      link(href, title, text) {
        return '' + text;
      }

      image(href, title, text) {
        return '' + text;
      }

      br() {
        return '';
      }
    };

    /**
     * Slugger generates header id
     */

    var Slugger_1 = class Slugger {
      constructor() {
        this.seen = {};
      }

      serialize(value) {
        return value
          .toLowerCase()
          .trim()
          // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '')
          // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
          .replace(/\s/g, '-');
      }

      /**
       * Finds the next safe (unique) slug to use
       */
      getNextSafeSlug(originalSlug, isDryRun) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + '-' + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      }

      /**
       * Convert string to unique id
       * @param {object} options
       * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
       */
      slug(value, options = {}) {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
      }
    };

    const Renderer$1 = Renderer_1;
    const TextRenderer$1 = TextRenderer_1;
    const Slugger$1 = Slugger_1;
    const { defaults: defaults$1 } = defaults$5.exports;
    const {
      unescape
    } = helpers;

    /**
     * Parsing & Compiling
     */
    var Parser_1 = class Parser {
      constructor(options) {
        this.options = options || defaults$1;
        this.options.renderer = this.options.renderer || new Renderer$1();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer$1();
        this.slugger = new Slugger$1();
      }

      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
        const parser = new Parser(options);
        return parser.parse(tokens);
      }

      /**
       * Static Parse Inline Method
       */
      static parseInline(tokens, options) {
        const parser = new Parser(options);
        return parser.parseInline(tokens);
      }

      /**
       * Parse Loop
       */
      parse(tokens, top = true) {
        let out = '',
          i,
          j,
          k,
          l2,
          l3,
          row,
          cell,
          header,
          body,
          token,
          ordered,
          start,
          loose,
          itemBody,
          item,
          checked,
          task,
          checkbox,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call(this, token);
            if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'space': {
              continue;
            }
            case 'hr': {
              out += this.renderer.hr();
              continue;
            }
            case 'heading': {
              out += this.renderer.heading(
                this.parseInline(token.tokens),
                token.depth,
                unescape(this.parseInline(token.tokens, this.textRenderer)),
                this.slugger);
              continue;
            }
            case 'code': {
              out += this.renderer.code(token.text,
                token.lang,
                token.escaped);
              continue;
            }
            case 'table': {
              header = '';

              // header
              cell = '';
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(
                  this.parseInline(token.tokens.header[j]),
                  { header: true, align: token.align[j] }
                );
              }
              header += this.renderer.tablerow(cell);

              body = '';
              l2 = token.cells.length;
              for (j = 0; j < l2; j++) {
                row = token.tokens.cells[j];

                cell = '';
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(
                    this.parseInline(row[k]),
                    { header: false, align: token.align[k] }
                  );
                }

                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case 'blockquote': {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case 'list': {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;

              body = '';
              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;

                itemBody = '';
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === 'text') {
                      item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: 'text',
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }

                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }

              out += this.renderer.list(body, ordered, start);
              continue;
            }
            case 'html': {
              // TODO parse inline content if parameter markdown=1
              out += this.renderer.html(token.text);
              continue;
            }
            case 'paragraph': {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }
            case 'text': {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;
              while (i + 1 < l && tokens[i + 1].type === 'text') {
                token = tokens[++i];
                body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }

            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }

        return out;
      }

      /**
       * Parse Inline Tokens
       */
      parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        let out = '',
          i,
          token,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call(this, token);
            if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'escape': {
              out += renderer.text(token.text);
              break;
            }
            case 'html': {
              out += renderer.html(token.text);
              break;
            }
            case 'link': {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }
            case 'image': {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }
            case 'strong': {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'em': {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'codespan': {
              out += renderer.codespan(token.text);
              break;
            }
            case 'br': {
              out += renderer.br();
              break;
            }
            case 'del': {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'text': {
              out += renderer.text(token.text);
              break;
            }
            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
    };

    const Lexer$1 = Lexer_1;
    const Parser$1 = Parser_1;
    const Tokenizer = Tokenizer_1;
    const Renderer = Renderer_1;
    const TextRenderer = TextRenderer_1;
    const Slugger = Slugger_1;
    const {
      merge,
      checkSanitizeDeprecation,
      escape
    } = helpers;
    const {
      getDefaults,
      changeDefaults,
      defaults
    } = defaults$5.exports;

    /**
     * Marked
     */
    function marked(src, opt, callback) {
      // throw error in case of non string input
      if (typeof src === 'undefined' || src === null) {
        throw new Error('marked(): input parameter is undefined or null');
      }
      if (typeof src !== 'string') {
        throw new Error('marked(): input parameter is of type '
          + Object.prototype.toString.call(src) + ', string expected');
      }

      if (typeof opt === 'function') {
        callback = opt;
        opt = null;
      }

      opt = merge({}, marked.defaults, opt || {});
      checkSanitizeDeprecation(opt);

      if (callback) {
        const highlight = opt.highlight;
        let tokens;

        try {
          tokens = Lexer$1.lex(src, opt);
        } catch (e) {
          return callback(e);
        }

        const done = function(err) {
          let out;

          if (!err) {
            try {
              if (opt.walkTokens) {
                marked.walkTokens(tokens, opt.walkTokens);
              }
              out = Parser$1.parse(tokens, opt);
            } catch (e) {
              err = e;
            }
          }

          opt.highlight = highlight;

          return err
            ? callback(err)
            : callback(null, out);
        };

        if (!highlight || highlight.length < 3) {
          return done();
        }

        delete opt.highlight;

        if (!tokens.length) return done();

        let pending = 0;
        marked.walkTokens(tokens, function(token) {
          if (token.type === 'code') {
            pending++;
            setTimeout(() => {
              highlight(token.text, token.lang, function(err, code) {
                if (err) {
                  return done(err);
                }
                if (code != null && code !== token.text) {
                  token.text = code;
                  token.escaped = true;
                }

                pending--;
                if (pending === 0) {
                  done();
                }
              });
            }, 0);
          }
        });

        if (pending === 0) {
          done();
        }

        return;
      }

      try {
        const tokens = Lexer$1.lex(src, opt);
        if (opt.walkTokens) {
          marked.walkTokens(tokens, opt.walkTokens);
        }
        return Parser$1.parse(tokens, opt);
      } catch (e) {
        e.message += '\nPlease report this to https://github.com/markedjs/marked.';
        if (opt.silent) {
          return '<p>An error occurred:</p><pre>'
            + escape(e.message + '', true)
            + '</pre>';
        }
        throw e;
      }
    }

    /**
     * Options
     */

    marked.options =
    marked.setOptions = function(opt) {
      merge(marked.defaults, opt);
      changeDefaults(marked.defaults);
      return marked;
    };

    marked.getDefaults = getDefaults;

    marked.defaults = defaults;

    /**
     * Use Extension
     */

    marked.use = function(...args) {
      const opts = merge({}, ...args);
      const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };
      let hasExtensions;

      args.forEach((pack) => {
        // ==-- Parse "addon" extensions --== //
        if (pack.extensions) {
          hasExtensions = true;
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error('extension name required');
            }
            if (ext.renderer) { // Renderer extensions
              const prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;
              if (prevRenderer) {
                // Replace extension with func to run new extension but fall back if false
                extensions.renderers[ext.name] = function(...args) {
                  let ret = ext.renderer.apply(this, args);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if (ext.tokenizer) { // Tokenizer Extensions
              if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              if (extensions[ext.level]) {
                extensions[ext.level].unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) { // Function to check for start of token
                if (ext.level === 'block') {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === 'inline') {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if (ext.childTokens) { // Child tokens to be visited by walkTokens
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
        }

        // ==-- Parse "overwrite" extensions --== //
        if (pack.renderer) {
          const renderer = marked.defaults.renderer || new Renderer();
          for (const prop in pack.renderer) {
            const prevRenderer = renderer[prop];
            // Replace renderer with func to run extension, but fall back if false
            renderer[prop] = (...args) => {
              let ret = pack.renderer[prop].apply(renderer, args);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args);
              }
              return ret;
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = marked.defaults.tokenizer || new Tokenizer();
          for (const prop in pack.tokenizer) {
            const prevTokenizer = tokenizer[prop];
            // Replace tokenizer with func to run extension, but fall back if false
            tokenizer[prop] = (...args) => {
              let ret = pack.tokenizer[prop].apply(tokenizer, args);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }

        // ==-- Parse WalkTokens extensions --== //
        if (pack.walkTokens) {
          const walkTokens = marked.defaults.walkTokens;
          opts.walkTokens = (token) => {
            pack.walkTokens.call(this, token);
            if (walkTokens) {
              walkTokens(token);
            }
          };
        }

        if (hasExtensions) {
          opts.extensions = extensions;
        }

        marked.setOptions(opts);
      });
    };

    /**
     * Run callback for every token
     */

    marked.walkTokens = function(tokens, callback) {
      for (const token of tokens) {
        callback(token);
        switch (token.type) {
          case 'table': {
            for (const cell of token.tokens.header) {
              marked.walkTokens(cell, callback);
            }
            for (const row of token.tokens.cells) {
              for (const cell of row) {
                marked.walkTokens(cell, callback);
              }
            }
            break;
          }
          case 'list': {
            marked.walkTokens(token.items, callback);
            break;
          }
          default: {
            if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) { // Walk any extensions
              marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
                marked.walkTokens(token[childTokens], callback);
              });
            } else if (token.tokens) {
              marked.walkTokens(token.tokens, callback);
            }
          }
        }
      }
    };

    /**
     * Parse Inline
     */
    marked.parseInline = function(src, opt) {
      // throw error in case of non string input
      if (typeof src === 'undefined' || src === null) {
        throw new Error('marked.parseInline(): input parameter is undefined or null');
      }
      if (typeof src !== 'string') {
        throw new Error('marked.parseInline(): input parameter is of type '
          + Object.prototype.toString.call(src) + ', string expected');
      }

      opt = merge({}, marked.defaults, opt || {});
      checkSanitizeDeprecation(opt);

      try {
        const tokens = Lexer$1.lexInline(src, opt);
        if (opt.walkTokens) {
          marked.walkTokens(tokens, opt.walkTokens);
        }
        return Parser$1.parseInline(tokens, opt);
      } catch (e) {
        e.message += '\nPlease report this to https://github.com/markedjs/marked.';
        if (opt.silent) {
          return '<p>An error occurred:</p><pre>'
            + escape(e.message + '', true)
            + '</pre>';
        }
        throw e;
      }
    };

    /**
     * Expose
     */

    marked.Parser = Parser$1;
    marked.parser = Parser$1.parse;

    marked.Renderer = Renderer;
    marked.TextRenderer = TextRenderer;

    marked.Lexer = Lexer$1;
    marked.lexer = Lexer$1.lex;

    marked.Tokenizer = Tokenizer;

    marked.Slugger = Slugger;

    marked.parse = marked;

    var marked_1 = marked;

    const ALIAS = Symbol.for('yaml.alias');
    const DOC = Symbol.for('yaml.document');
    const MAP = Symbol.for('yaml.map');
    const PAIR = Symbol.for('yaml.pair');
    const SCALAR$1 = Symbol.for('yaml.scalar');
    const SEQ = Symbol.for('yaml.seq');
    const NODE_TYPE = Symbol.for('yaml.node.type');
    const isAlias = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === ALIAS;
    const isDocument = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === DOC;
    const isMap = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === MAP;
    const isPair = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === PAIR;
    const isScalar = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === SCALAR$1;
    const isSeq = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
        if (node && typeof node === 'object')
            switch (node[NODE_TYPE]) {
                case MAP:
                case SEQ:
                    return true;
            }
        return false;
    }
    function isNode(node) {
        if (node && typeof node === 'object')
            switch (node[NODE_TYPE]) {
                case ALIAS:
                case MAP:
                case SCALAR$1:
                case SEQ:
                    return true;
            }
        return false;
    }
    const hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    class NodeBase {
        constructor(type) {
            Object.defineProperty(this, NODE_TYPE, { value: type });
        }
    }

    const BREAK = Symbol('break visit');
    const SKIP = Symbol('skip children');
    const REMOVE = Symbol('remove node');
    /**
     * Apply a visitor to an AST node or document.
     *
     * Walks through the tree (depth-first) starting from `node`, calling a
     * `visitor` function with three arguments:
     *   - `key`: For sequence values and map `Pair`, the node's index in the
     *     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
     *     `null` for the root node.
     *   - `node`: The current node.
     *   - `path`: The ancestry of the current node.
     *
     * The return value of the visitor may be used to control the traversal:
     *   - `undefined` (default): Do nothing and continue
     *   - `visit.SKIP`: Do not visit the children of this node, continue with next
     *     sibling
     *   - `visit.BREAK`: Terminate traversal completely
     *   - `visit.REMOVE`: Remove the current node, then continue with the next one
     *   - `Node`: Replace the current node, then continue by visiting it
     *   - `number`: While iterating the items of a sequence or map, set the index
     *     of the next step. This is useful especially if the index of the current
     *     node has changed.
     *
     * If `visitor` is a single function, it will be called with all values
     * encountered in the tree, including e.g. `null` values. Alternatively,
     * separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
     * `Alias` and `Scalar` node. To define the same visitor function for more than
     * one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
     * and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
     * specific defined one will be used for each node.
     */
    function visit(node, visitor) {
        if (typeof visitor === 'object' &&
            (visitor.Collection || visitor.Node || visitor.Value)) {
            visitor = Object.assign({
                Alias: visitor.Node,
                Map: visitor.Node,
                Scalar: visitor.Node,
                Seq: visitor.Node
            }, visitor.Value && {
                Map: visitor.Value,
                Scalar: visitor.Value,
                Seq: visitor.Value
            }, visitor.Collection && {
                Map: visitor.Collection,
                Seq: visitor.Collection
            }, visitor);
        }
        if (isDocument(node)) {
            const cd = _visit(null, node.contents, visitor, Object.freeze([node]));
            if (cd === REMOVE)
                node.contents = null;
        }
        else
            _visit(null, node, visitor, Object.freeze([]));
    }
    // Without the `as symbol` casts, TS declares these in the `visit`
    // namespace using `var`, but then complains about that because
    // `unique symbol` must be `const`.
    /** Terminate visit traversal completely */
    visit.BREAK = BREAK;
    /** Do not visit the children of the current node */
    visit.SKIP = SKIP;
    /** Remove the current node */
    visit.REMOVE = REMOVE;
    function _visit(key, node, visitor, path) {
        let ctrl = undefined;
        if (typeof visitor === 'function')
            ctrl = visitor(key, node, path);
        else if (isMap(node)) {
            if (visitor.Map)
                ctrl = visitor.Map(key, node, path);
        }
        else if (isSeq(node)) {
            if (visitor.Seq)
                ctrl = visitor.Seq(key, node, path);
        }
        else if (isPair(node)) {
            if (visitor.Pair)
                ctrl = visitor.Pair(key, node, path);
        }
        else if (isScalar(node)) {
            if (visitor.Scalar)
                ctrl = visitor.Scalar(key, node, path);
        }
        else if (isAlias(node)) {
            if (visitor.Alias)
                ctrl = visitor.Alias(key, node, path);
        }
        if (isNode(ctrl) || isPair(ctrl)) {
            const parent = path[path.length - 1];
            if (isCollection(parent)) {
                parent.items[key] = ctrl;
            }
            else if (isPair(parent)) {
                if (key === 'key')
                    parent.key = ctrl;
                else
                    parent.value = ctrl;
            }
            else if (isDocument(parent)) {
                parent.contents = ctrl;
            }
            else {
                const pt = isAlias(parent) ? 'alias' : 'scalar';
                throw new Error(`Cannot replace node with ${pt} parent`);
            }
            return _visit(key, ctrl, visitor, path);
        }
        if (typeof ctrl !== 'symbol') {
            if (isCollection(node)) {
                path = Object.freeze(path.concat(node));
                for (let i = 0; i < node.items.length; ++i) {
                    const ci = _visit(i, node.items[i], visitor, path);
                    if (typeof ci === 'number')
                        i = ci - 1;
                    else if (ci === BREAK)
                        return BREAK;
                    else if (ci === REMOVE) {
                        node.items.splice(i, 1);
                        i -= 1;
                    }
                }
            }
            else if (isPair(node)) {
                path = Object.freeze(path.concat(node));
                const ck = _visit('key', node.key, visitor, path);
                if (ck === BREAK)
                    return BREAK;
                else if (ck === REMOVE)
                    node.key = null;
                const cv = _visit('value', node.value, visitor, path);
                if (cv === BREAK)
                    return BREAK;
                else if (cv === REMOVE)
                    node.value = null;
            }
        }
        return ctrl;
    }

    const escapeChars = {
        '!': '%21',
        ',': '%2C',
        '[': '%5B',
        ']': '%5D',
        '{': '%7B',
        '}': '%7D'
    };
    const escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, ch => escapeChars[ch]);
    class Directives {
        constructor(yaml, tags) {
            /**
             * The directives-end/doc-start marker `---`. If `null`, a marker may still be
             * included in the document's stringified representation.
             */
            this.marker = null;
            this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
            this.tags = Object.assign({}, Directives.defaultTags, tags);
        }
        /**
         * During parsing, get a Directives instance for the current document and
         * update the stream state according to the current version's spec.
         */
        atDocument() {
            const res = new Directives(this.yaml, this.tags);
            switch (this.yaml.version) {
                case '1.1':
                    this.atNextDocument = true;
                    break;
                case '1.2':
                    this.atNextDocument = false;
                    this.yaml = {
                        explicit: Directives.defaultYaml.explicit,
                        version: '1.2'
                    };
                    this.tags = Object.assign({}, Directives.defaultTags);
                    break;
            }
            return res;
        }
        /**
         * @param onError - May be called even if the action was successful
         * @returns `true` on success
         */
        add(line, onError) {
            if (this.atNextDocument) {
                this.yaml = { explicit: Directives.defaultYaml.explicit, version: '1.1' };
                this.tags = Object.assign({}, Directives.defaultTags);
                this.atNextDocument = false;
            }
            const parts = line.trim().split(/[ \t]+/);
            const name = parts.shift();
            switch (name) {
                case '%TAG': {
                    if (parts.length !== 2) {
                        onError(0, '%TAG directive should contain exactly two parts');
                        if (parts.length < 2)
                            return false;
                    }
                    const [handle, prefix] = parts;
                    this.tags[handle] = prefix;
                    return true;
                }
                case '%YAML': {
                    this.yaml.explicit = true;
                    if (parts.length < 1) {
                        onError(0, '%YAML directive should contain exactly one part');
                        return false;
                    }
                    const [version] = parts;
                    if (version === '1.1' || version === '1.2') {
                        this.yaml.version = version;
                        return true;
                    }
                    else {
                        onError(6, `Unsupported YAML version ${version}`, true);
                        return false;
                    }
                }
                default:
                    onError(0, `Unknown directive ${name}`, true);
                    return false;
            }
        }
        /**
         * Resolves a tag, matching handles to those defined in %TAG directives.
         *
         * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
         *   `'!local'` tag, or `null` if unresolvable.
         */
        tagName(source, onError) {
            if (source === '!')
                return '!'; // non-specific tag
            if (source[0] !== '!') {
                onError(`Not a valid tag: ${source}`);
                return null;
            }
            if (source[1] === '<') {
                const verbatim = source.slice(2, -1);
                if (verbatim === '!' || verbatim === '!!') {
                    onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
                    return null;
                }
                if (source[source.length - 1] !== '>')
                    onError('Verbatim tags must end with a >');
                return verbatim;
            }
            const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/);
            if (!suffix)
                onError(`The ${source} tag has no suffix`);
            const prefix = this.tags[handle];
            if (prefix)
                return prefix + decodeURIComponent(suffix);
            if (handle === '!')
                return source; // local tag
            onError(`Could not resolve tag: ${source}`);
            return null;
        }
        /**
         * Given a fully resolved tag, returns its printable string form,
         * taking into account current tag prefixes and defaults.
         */
        tagString(tag) {
            for (const [handle, prefix] of Object.entries(this.tags)) {
                if (tag.startsWith(prefix))
                    return handle + escapeTagName(tag.substring(prefix.length));
            }
            return tag[0] === '!' ? tag : `!<${tag}>`;
        }
        toString(doc) {
            const lines = this.yaml.explicit
                ? [`%YAML ${this.yaml.version || '1.2'}`]
                : [];
            const tagEntries = Object.entries(this.tags);
            let tagNames;
            if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
                const tags = {};
                visit(doc.contents, (_key, node) => {
                    if (isNode(node) && node.tag)
                        tags[node.tag] = true;
                });
                tagNames = Object.keys(tags);
            }
            else
                tagNames = [];
            for (const [handle, prefix] of tagEntries) {
                if (handle === '!!' && prefix === 'tag:yaml.org,2002:')
                    continue;
                if (!doc || tagNames.some(tn => tn.startsWith(prefix)))
                    lines.push(`%TAG ${handle} ${prefix}`);
            }
            return lines.join('\n');
        }
    }
    Directives.defaultYaml = { explicit: false, version: '1.2' };
    Directives.defaultTags = { '!!': 'tag:yaml.org,2002:' };

    /**
     * Verify that the input string is a valid anchor.
     *
     * Will throw on errors.
     */
    function anchorIsValid(anchor) {
        if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
            const sa = JSON.stringify(anchor);
            const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
            throw new Error(msg);
        }
        return true;
    }
    function anchorNames(root) {
        const anchors = new Set();
        visit(root, {
            Value(_key, node) {
                if (node.anchor)
                    anchors.add(node.anchor);
            }
        });
        return anchors;
    }
    /** Find a new anchor name with the given `prefix` and a one-indexed suffix. */
    function findNewAnchor(prefix, exclude) {
        for (let i = 1; true; ++i) {
            const name = `${prefix}${i}`;
            if (!exclude.has(name))
                return name;
        }
    }
    function createNodeAnchors(doc, prefix) {
        const aliasObjects = [];
        const sourceObjects = new Map();
        let prevAnchors = null;
        return {
            onAnchor(source) {
                aliasObjects.push(source);
                if (!prevAnchors)
                    prevAnchors = anchorNames(doc);
                const anchor = findNewAnchor(prefix, prevAnchors);
                prevAnchors.add(anchor);
                return anchor;
            },
            /**
             * With circular references, the source node is only resolved after all
             * of its child nodes are. This is why anchors are set only after all of
             * the nodes have been created.
             */
            setAnchors() {
                for (const source of aliasObjects) {
                    const ref = sourceObjects.get(source);
                    if (typeof ref === 'object' &&
                        ref.anchor &&
                        (isScalar(ref.node) || isCollection(ref.node))) {
                        ref.node.anchor = ref.anchor;
                    }
                    else {
                        const error = new Error('Failed to resolve repeated object (this should not happen)');
                        error.source = source;
                        throw error;
                    }
                }
            },
            sourceObjects
        };
    }

    class Alias extends NodeBase {
        constructor(source) {
            super(ALIAS);
            this.source = source;
            Object.defineProperty(this, 'tag', {
                set() {
                    throw new Error('Alias nodes cannot have tags');
                }
            });
        }
        /**
         * Resolve the value of this alias within `doc`, finding the last
         * instance of the `source` anchor before this node.
         */
        resolve(doc) {
            let found = undefined;
            visit(doc, {
                Node: (_key, node) => {
                    if (node === this)
                        return visit.BREAK;
                    if (node.anchor === this.source)
                        found = node;
                }
            });
            return found;
        }
        toJSON(_arg, ctx) {
            if (!ctx)
                return { source: this.source };
            const { anchors, doc, maxAliasCount } = ctx;
            const source = this.resolve(doc);
            if (!source) {
                const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                throw new ReferenceError(msg);
            }
            const data = anchors.get(source);
            /* istanbul ignore if */
            if (!data || data.res === undefined) {
                const msg = 'This should not happen: Alias anchor was not resolved?';
                throw new ReferenceError(msg);
            }
            if (maxAliasCount >= 0) {
                data.count += 1;
                if (data.aliasCount === 0)
                    data.aliasCount = getAliasCount(doc, source, anchors);
                if (data.count * data.aliasCount > maxAliasCount) {
                    const msg = 'Excessive alias count indicates a resource exhaustion attack';
                    throw new ReferenceError(msg);
                }
            }
            return data.res;
        }
        toString(ctx, _onComment, _onChompKeep) {
            const src = `*${this.source}`;
            if (ctx) {
                anchorIsValid(this.source);
                if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
                    const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                    throw new Error(msg);
                }
                if (ctx.implicitKey)
                    return `${src} `;
            }
            return src;
        }
    }
    function getAliasCount(doc, node, anchors) {
        if (isAlias(node)) {
            const source = node.resolve(doc);
            const anchor = anchors && source && anchors.get(source);
            return anchor ? anchor.count * anchor.aliasCount : 0;
        }
        else if (isCollection(node)) {
            let count = 0;
            for (const item of node.items) {
                const c = getAliasCount(doc, item, anchors);
                if (c > count)
                    count = c;
            }
            return count;
        }
        else if (isPair(node)) {
            const kc = getAliasCount(doc, node.key, anchors);
            const vc = getAliasCount(doc, node.value, anchors);
            return Math.max(kc, vc);
        }
        return 1;
    }

    /**
     * Recursively convert any node or its contents to native JavaScript
     *
     * @param value - The input value
     * @param arg - If `value` defines a `toJSON()` method, use this
     *   as its first argument
     * @param ctx - Conversion context, originally set in Document#toJS(). If
     *   `{ keep: true }` is not set, output should be suitable for JSON
     *   stringification.
     */
    function toJS(value, arg, ctx) {
        if (Array.isArray(value))
            return value.map((v, i) => toJS(v, String(i), ctx));
        if (value && typeof value.toJSON === 'function') {
            if (!ctx || !hasAnchor(value))
                return value.toJSON(arg, ctx);
            const data = { aliasCount: 0, count: 1, res: undefined };
            ctx.anchors.set(value, data);
            ctx.onCreate = res => {
                data.res = res;
                delete ctx.onCreate;
            };
            const res = value.toJSON(arg, ctx);
            if (ctx.onCreate)
                ctx.onCreate(res);
            return res;
        }
        if (typeof value === 'bigint' && !(ctx && ctx.keep))
            return Number(value);
        return value;
    }

    const isScalarValue = (value) => !value || (typeof value !== 'function' && typeof value !== 'object');
    class Scalar extends NodeBase {
        constructor(value) {
            super(SCALAR$1);
            this.value = value;
        }
        toJSON(arg, ctx) {
            return ctx && ctx.keep ? this.value : toJS(this.value, arg, ctx);
        }
        toString() {
            return String(this.value);
        }
    }
    Scalar.BLOCK_FOLDED = 'BLOCK_FOLDED';
    Scalar.BLOCK_LITERAL = 'BLOCK_LITERAL';
    Scalar.PLAIN = 'PLAIN';
    Scalar.QUOTE_DOUBLE = 'QUOTE_DOUBLE';
    Scalar.QUOTE_SINGLE = 'QUOTE_SINGLE';

    const defaultTagPrefix = 'tag:yaml.org,2002:';
    function findTagObject(value, tagName, tags) {
        if (tagName) {
            const match = tags.filter(t => t.tag === tagName);
            const tagObj = match.find(t => !t.format) || match[0];
            if (!tagObj)
                throw new Error(`Tag ${tagName} not found`);
            return tagObj;
        }
        return tags.find(t => t.identify && t.identify(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
        var _a, _b;
        if (isNode(value))
            return value;
        if (isPair(value)) {
            const map = (_b = (_a = ctx.schema[MAP]).createNode) === null || _b === void 0 ? void 0 : _b.call(_a, ctx.schema, null, ctx);
            map.items.push(value);
            return map;
        }
        if (value instanceof String ||
            value instanceof Number ||
            value instanceof Boolean ||
            (typeof BigInt === 'function' && value instanceof BigInt) // not supported everywhere
        ) {
            // https://tc39.es/ecma262/#sec-serializejsonproperty
            value = value.valueOf();
        }
        const { onAnchor, onTagObj, schema, sourceObjects } = ctx;
        // Detect duplicate references to the same object & use Alias nodes for all
        // after first. The `ref` wrapper allows for circular references to resolve.
        let ref = undefined;
        if (value && typeof value === 'object') {
            ref = sourceObjects.get(value);
            if (ref) {
                if (!ref.anchor)
                    ref.anchor = onAnchor(value);
                return new Alias(ref.anchor);
            }
            else {
                ref = { anchor: null, node: null };
                sourceObjects.set(value, ref);
            }
        }
        if (tagName && tagName.startsWith('!!'))
            tagName = defaultTagPrefix + tagName.slice(2);
        let tagObj = findTagObject(value, tagName, schema.tags);
        if (!tagObj) {
            if (value && typeof value.toJSON === 'function')
                value = value.toJSON();
            if (!value || typeof value !== 'object')
                return new Scalar(value);
            tagObj =
                value instanceof Map
                    ? schema[MAP]
                    : Symbol.iterator in Object(value)
                        ? schema[SEQ]
                        : schema[MAP];
        }
        if (onTagObj) {
            onTagObj(tagObj);
            delete ctx.onTagObj;
        }
        const node = (tagObj === null || tagObj === void 0 ? void 0 : tagObj.createNode)
            ? tagObj.createNode(ctx.schema, value, ctx)
            : new Scalar(value);
        if (tagName)
            node.tag = tagName;
        if (ref)
            ref.node = node;
        return node;
    }

    function collectionFromPath(schema, path, value) {
        let v = value;
        for (let i = path.length - 1; i >= 0; --i) {
            const k = path[i];
            if (typeof k === 'number' && Number.isInteger(k) && k >= 0) {
                const a = [];
                a[k] = v;
                v = a;
            }
            else {
                const o = {};
                Object.defineProperty(o, typeof k === 'symbol' ? k : String(k), {
                    value: v,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                v = o;
            }
        }
        return createNode(v, undefined, {
            onAnchor() {
                throw new Error('Repeated objects are not supported here');
            },
            schema,
            sourceObjects: new Map()
        });
    }
    // null, undefined, or an empty non-string iterable (e.g. [])
    const isEmptyPath = (path) => path == null ||
        (typeof path === 'object' && !!path[Symbol.iterator]().next().done);
    class Collection extends NodeBase {
        constructor(type, schema) {
            super(type);
            Object.defineProperty(this, 'schema', {
                value: schema,
                configurable: true,
                enumerable: false,
                writable: true
            });
        }
        /**
         * Adds a value to the collection. For `!!map` and `!!omap` the value must
         * be a Pair instance or a `{ key, value }` object, which may not have a key
         * that already exists in the map.
         */
        addIn(path, value) {
            if (isEmptyPath(path))
                this.add(value);
            else {
                const [key, ...rest] = path;
                const node = this.get(key, true);
                if (isCollection(node))
                    node.addIn(rest, value);
                else if (node === undefined && this.schema)
                    this.set(key, collectionFromPath(this.schema, rest, value));
                else
                    throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
            }
        }
        /**
         * Removes a value from the collection.
         * @returns `true` if the item was found and removed.
         */
        deleteIn([key, ...rest]) {
            if (rest.length === 0)
                return this.delete(key);
            const node = this.get(key, true);
            if (isCollection(node))
                return node.deleteIn(rest);
            else
                throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
        /**
         * Returns item at `key`, or `undefined` if not found. By default unwraps
         * scalar values from their surrounding node; to disable set `keepScalar` to
         * `true` (collections are always returned intact).
         */
        getIn([key, ...rest], keepScalar) {
            const node = this.get(key, true);
            if (rest.length === 0)
                return !keepScalar && isScalar(node) ? node.value : node;
            else
                return isCollection(node) ? node.getIn(rest, keepScalar) : undefined;
        }
        hasAllNullValues(allowScalar) {
            return this.items.every(node => {
                if (!isPair(node))
                    return false;
                const n = node.value;
                return (n == null ||
                    (allowScalar &&
                        isScalar(n) &&
                        n.value == null &&
                        !n.commentBefore &&
                        !n.comment &&
                        !n.tag));
            });
        }
        /**
         * Checks if the collection includes a value with the key `key`.
         */
        hasIn([key, ...rest]) {
            if (rest.length === 0)
                return this.has(key);
            const node = this.get(key, true);
            return isCollection(node) ? node.hasIn(rest) : false;
        }
        /**
         * Sets a value in this collection. For `!!set`, `value` needs to be a
         * boolean to add/remove the item from the set.
         */
        setIn([key, ...rest], value) {
            if (rest.length === 0) {
                this.set(key, value);
            }
            else {
                const node = this.get(key, true);
                if (isCollection(node))
                    node.setIn(rest, value);
                else if (node === undefined && this.schema)
                    this.set(key, collectionFromPath(this.schema, rest, value));
                else
                    throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
            }
        }
    }
    Collection.maxFlowStringSingleLineLength = 60;

    function addComment(str, indent, comment) {
        return !comment
            ? str
            : comment.includes('\n')
                ? `${str}\n` + comment.replace(/^/gm, `${indent || ''}#`)
                : str.endsWith(' ')
                    ? `${str}#${comment}`
                    : `${str} #${comment}`;
    }

    const FOLD_FLOW = 'flow';
    const FOLD_BLOCK = 'block';
    const FOLD_QUOTED = 'quoted';
    /**
     * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
     * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
     * terminated with `\n` and started with `indent`.
     */
    function foldFlowLines(text, indent, mode = 'flow', { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
        if (!lineWidth || lineWidth < 0)
            return text;
        const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
        if (text.length <= endStep)
            return text;
        const folds = [];
        const escapedFolds = {};
        let end = lineWidth - indent.length;
        if (typeof indentAtStart === 'number') {
            if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
                folds.push(0);
            else
                end = lineWidth - indentAtStart;
        }
        let split = undefined;
        let prev = undefined;
        let overflow = false;
        let i = -1;
        let escStart = -1;
        let escEnd = -1;
        if (mode === FOLD_BLOCK) {
            i = consumeMoreIndentedLines(text, i);
            if (i !== -1)
                end = i + endStep;
        }
        for (let ch; (ch = text[(i += 1)]);) {
            if (mode === FOLD_QUOTED && ch === '\\') {
                escStart = i;
                switch (text[i + 1]) {
                    case 'x':
                        i += 3;
                        break;
                    case 'u':
                        i += 5;
                        break;
                    case 'U':
                        i += 9;
                        break;
                    default:
                        i += 1;
                }
                escEnd = i;
            }
            if (ch === '\n') {
                if (mode === FOLD_BLOCK)
                    i = consumeMoreIndentedLines(text, i);
                end = i + endStep;
                split = undefined;
            }
            else {
                if (ch === ' ' &&
                    prev &&
                    prev !== ' ' &&
                    prev !== '\n' &&
                    prev !== '\t') {
                    // space surrounded by non-space can be replaced with newline + indent
                    const next = text[i + 1];
                    if (next && next !== ' ' && next !== '\n' && next !== '\t')
                        split = i;
                }
                if (i >= end) {
                    if (split) {
                        folds.push(split);
                        end = split + endStep;
                        split = undefined;
                    }
                    else if (mode === FOLD_QUOTED) {
                        // white-space collected at end may stretch past lineWidth
                        while (prev === ' ' || prev === '\t') {
                            prev = ch;
                            ch = text[(i += 1)];
                            overflow = true;
                        }
                        // Account for newline escape, but don't break preceding escape
                        const j = i > escEnd + 1 ? i - 2 : escStart - 1;
                        // Bail out if lineWidth & minContentWidth are shorter than an escape string
                        if (escapedFolds[j])
                            return text;
                        folds.push(j);
                        escapedFolds[j] = true;
                        end = j + endStep;
                        split = undefined;
                    }
                    else {
                        overflow = true;
                    }
                }
            }
            prev = ch;
        }
        if (overflow && onOverflow)
            onOverflow();
        if (folds.length === 0)
            return text;
        if (onFold)
            onFold();
        let res = text.slice(0, folds[0]);
        for (let i = 0; i < folds.length; ++i) {
            const fold = folds[i];
            const end = folds[i + 1] || text.length;
            if (fold === 0)
                res = `\n${indent}${text.slice(0, end)}`;
            else {
                if (mode === FOLD_QUOTED && escapedFolds[fold])
                    res += `${text[fold]}\\`;
                res += `\n${indent}${text.slice(fold + 1, end)}`;
            }
        }
        return res;
    }
    /**
     * Presumes `i + 1` is at the start of a line
     * @returns index of last newline in more-indented block
     */
    function consumeMoreIndentedLines(text, i) {
        let ch = text[i + 1];
        while (ch === ' ' || ch === '\t') {
            do {
                ch = text[(i += 1)];
            } while (ch && ch !== '\n');
            ch = text[i + 1];
        }
        return i;
    }

    const getFoldOptions = (ctx) => ({
        indentAtStart: ctx.indentAtStart,
        lineWidth: ctx.options.lineWidth,
        minContentWidth: ctx.options.minContentWidth
    });
    // Also checks for lines starting with %, as parsing the output as YAML 1.1 will
    // presume that's starting a new document.
    const containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
        if (!lineWidth || lineWidth < 0)
            return false;
        const limit = lineWidth - indentLength;
        const strLen = str.length;
        if (strLen <= limit)
            return false;
        for (let i = 0, start = 0; i < strLen; ++i) {
            if (str[i] === '\n') {
                if (i - start > limit)
                    return true;
                start = i + 1;
                if (strLen - start <= limit)
                    return false;
            }
        }
        return true;
    }
    function doubleQuotedString(value, ctx) {
        const json = JSON.stringify(value);
        if (ctx.options.doubleQuotedAsJSON)
            return json;
        const { implicitKey } = ctx;
        const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
        const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
        let str = '';
        let start = 0;
        for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
            if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
                // space before newline needs to be escaped to not be folded
                str += json.slice(start, i) + '\\ ';
                i += 1;
                start = i;
                ch = '\\';
            }
            if (ch === '\\')
                switch (json[i + 1]) {
                    case 'u':
                        {
                            str += json.slice(start, i);
                            const code = json.substr(i + 2, 4);
                            switch (code) {
                                case '0000':
                                    str += '\\0';
                                    break;
                                case '0007':
                                    str += '\\a';
                                    break;
                                case '000b':
                                    str += '\\v';
                                    break;
                                case '001b':
                                    str += '\\e';
                                    break;
                                case '0085':
                                    str += '\\N';
                                    break;
                                case '00a0':
                                    str += '\\_';
                                    break;
                                case '2028':
                                    str += '\\L';
                                    break;
                                case '2029':
                                    str += '\\P';
                                    break;
                                default:
                                    if (code.substr(0, 2) === '00')
                                        str += '\\x' + code.substr(2);
                                    else
                                        str += json.substr(i, 6);
                            }
                            i += 5;
                            start = i + 1;
                        }
                        break;
                    case 'n':
                        if (implicitKey ||
                            json[i + 2] === '"' ||
                            json.length < minMultiLineLength) {
                            i += 1;
                        }
                        else {
                            // folding will eat first newline
                            str += json.slice(start, i) + '\n\n';
                            while (json[i + 2] === '\\' &&
                                json[i + 3] === 'n' &&
                                json[i + 4] !== '"') {
                                str += '\n';
                                i += 2;
                            }
                            str += indent;
                            // space after newline needs to be escaped to not be folded
                            if (json[i + 2] === ' ')
                                str += '\\';
                            i += 1;
                            start = i + 1;
                        }
                        break;
                    default:
                        i += 1;
                }
        }
        str = start ? str + json.slice(start) : json;
        return implicitKey
            ? str
            : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
    }
    function singleQuotedString(value, ctx) {
        if (ctx.implicitKey) {
            if (/\n/.test(value))
                return doubleQuotedString(value, ctx);
        }
        else {
            // single quoted string can't have leading or trailing whitespace around newline
            if (/[ \t]\n|\n[ \t]/.test(value))
                return doubleQuotedString(value, ctx);
        }
        const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
        const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
        return ctx.implicitKey
            ? res
            : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
        // 1. Block can't end in whitespace unless the last line is non-empty.
        // 2. Strings consisting of only whitespace are best rendered explicitly.
        if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
            return doubleQuotedString(value, ctx);
        }
        const indent = ctx.indent ||
            (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
        const literal = type === Scalar.BLOCK_FOLDED
            ? false
            : type === Scalar.BLOCK_LITERAL
                ? true
                : !lineLengthOverLimit(value, ctx.options.lineWidth, indent.length);
        if (!value)
            return literal ? '|\n' : '>\n';
        // determine chomping from whitespace at value end
        let chomp;
        let endStart;
        for (endStart = value.length; endStart > 0; --endStart) {
            const ch = value[endStart - 1];
            if (ch !== '\n' && ch !== '\t' && ch !== ' ')
                break;
        }
        let end = value.substring(endStart);
        const endNlPos = end.indexOf('\n');
        if (endNlPos === -1) {
            chomp = '-'; // strip
        }
        else if (value === end || endNlPos !== end.length - 1) {
            chomp = '+'; // keep
            if (onChompKeep)
                onChompKeep();
        }
        else {
            chomp = ''; // clip
        }
        if (end) {
            value = value.slice(0, -end.length);
            if (end[end.length - 1] === '\n')
                end = end.slice(0, -1);
            end = end.replace(/\n+(?!\n|$)/g, `$&${indent}`);
        }
        // determine indent indicator from whitespace at value start
        let startWithSpace = false;
        let startEnd;
        let startNlPos = -1;
        for (startEnd = 0; startEnd < value.length; ++startEnd) {
            const ch = value[startEnd];
            if (ch === ' ')
                startWithSpace = true;
            else if (ch === '\n')
                startNlPos = startEnd;
            else
                break;
        }
        let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
        if (start) {
            value = value.substring(start.length);
            start = start.replace(/\n+/g, `$&${indent}`);
        }
        const indentSize = indent ? '2' : '1'; // root is at -1
        let header = (literal ? '|' : '>') + (startWithSpace ? indentSize : '') + chomp;
        if (comment) {
            header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
            if (onComment)
                onComment();
        }
        if (literal) {
            value = value.replace(/\n+/g, `$&${indent}`);
            return `${header}\n${indent}${start}${value}${end}`;
        }
        value = value
            .replace(/\n+/g, '\n$&')
            .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
            //                ^ more-ind. ^ empty     ^ capture next empty lines only at end of indent
            .replace(/\n+/g, `$&${indent}`);
        const body = foldFlowLines(`${start}${value}${end}`, indent, FOLD_BLOCK, getFoldOptions(ctx));
        return `${header}\n${indent}${body}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
        var _a;
        const { type, value } = item;
        const { actualString, implicitKey, indent, inFlow } = ctx;
        if ((implicitKey && /[\n[\]{},]/.test(value)) ||
            (inFlow && /[[\]{},]/.test(value))) {
            return doubleQuotedString(value, ctx);
        }
        if (!value ||
            /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
            const hasDouble = value.indexOf('"') !== -1;
            const hasSingle = value.indexOf("'") !== -1;
            let quotedString;
            if (hasDouble && !hasSingle) {
                quotedString = singleQuotedString;
            }
            else if (hasSingle && !hasDouble) {
                quotedString = doubleQuotedString;
            }
            else if (ctx.options.singleQuote) {
                quotedString = singleQuotedString;
            }
            else {
                quotedString = doubleQuotedString;
            }
            // not allowed:
            // - empty string, '-' or '?'
            // - start with an indicator character (except [?:-]) or /[?-] /
            // - '\n ', ': ' or ' \n' anywhere
            // - '#' not preceded by a non-space char
            // - end with ' ' or ':'
            return implicitKey || inFlow || value.indexOf('\n') === -1
                ? quotedString(value, ctx)
                : blockString(item, ctx, onComment, onChompKeep);
        }
        if (!implicitKey &&
            !inFlow &&
            type !== Scalar.PLAIN &&
            value.indexOf('\n') !== -1) {
            // Where allowed & type not set explicitly, prefer block style for multiline strings
            return blockString(item, ctx, onComment, onChompKeep);
        }
        if (indent === '' && containsDocumentMarker(value)) {
            ctx.forceBlockIndent = true;
            return blockString(item, ctx, onComment, onChompKeep);
        }
        const str = value.replace(/\n+/g, `$&\n${indent}`);
        // Verify that output will be parsed as a string, as e.g. plain numbers and
        // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
        // and others in v1.1.
        if (actualString) {
            for (const tag of ctx.doc.schema.tags) {
                if (tag.default &&
                    tag.tag !== 'tag:yaml.org,2002:str' &&
                    ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(str)))
                    return doubleQuotedString(value, ctx);
            }
        }
        return implicitKey
            ? str
            : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
        const { implicitKey, inFlow } = ctx;
        const ss = typeof item.value === 'string'
            ? item
            : Object.assign({}, item, { value: String(item.value) });
        let { type } = item;
        if (type !== Scalar.QUOTE_DOUBLE) {
            // force double quotes on control characters & unpaired surrogates
            if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
                type = Scalar.QUOTE_DOUBLE;
        }
        const _stringify = (_type) => {
            switch (_type) {
                case Scalar.BLOCK_FOLDED:
                case Scalar.BLOCK_LITERAL:
                    return implicitKey || inFlow
                        ? doubleQuotedString(ss.value, ctx) // blocks are not valid inside flow containers
                        : blockString(ss, ctx, onComment, onChompKeep);
                case Scalar.QUOTE_DOUBLE:
                    return doubleQuotedString(ss.value, ctx);
                case Scalar.QUOTE_SINGLE:
                    return singleQuotedString(ss.value, ctx);
                case Scalar.PLAIN:
                    return plainString(ss, ctx, onComment, onChompKeep);
                default:
                    return null;
            }
        };
        let res = _stringify(type);
        if (res === null) {
            const { defaultKeyType, defaultStringType } = ctx.options;
            const t = (implicitKey && defaultKeyType) || defaultStringType;
            res = _stringify(t);
            if (res === null)
                throw new Error(`Unsupported default string type ${t}`);
        }
        return res;
    }

    const createStringifyContext = (doc, options) => ({
        anchors: new Set(),
        doc,
        indent: '',
        indentStep: typeof options.indent === 'number' ? ' '.repeat(options.indent) : '  ',
        options: Object.assign({
            defaultKeyType: null,
            defaultStringType: 'PLAIN',
            directives: null,
            doubleQuotedAsJSON: false,
            doubleQuotedMinMultiLineLength: 40,
            falseStr: 'false',
            indentSeq: true,
            lineWidth: 80,
            minContentWidth: 20,
            nullStr: 'null',
            simpleKeys: false,
            singleQuote: false,
            trueStr: 'true',
            verifyAliasOrder: true
        }, options)
    });
    function getTagObject(tags, item) {
        if (item.tag) {
            const match = tags.filter(t => t.tag === item.tag);
            if (match.length > 0)
                return match.find(t => t.format === item.format) || match[0];
        }
        let tagObj = undefined;
        let obj;
        if (isScalar(item)) {
            obj = item.value;
            const match = tags.filter(t => t.identify && t.identify(obj));
            tagObj =
                match.find(t => t.format === item.format) || match.find(t => !t.format);
        }
        else {
            obj = item;
            tagObj = tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
        }
        if (!tagObj) {
            // @ts-ignore
            const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
            throw new Error(`Tag not resolved for ${name} value`);
        }
        return tagObj;
    }
    // needs to be called before value stringifier to allow for circular anchor refs
    function stringifyProps(node, tagObj, { anchors, doc }) {
        const props = [];
        const anchor = (isScalar(node) || isCollection(node)) && node.anchor;
        if (anchor && anchorIsValid(anchor)) {
            anchors.add(anchor);
            props.push(`&${anchor}`);
        }
        if (node.tag) {
            props.push(doc.directives.tagString(node.tag));
        }
        else if (!tagObj.default) {
            props.push(doc.directives.tagString(tagObj.tag));
        }
        return props.join(' ');
    }
    function stringify(item, ctx, onComment, onChompKeep) {
        if (isPair(item))
            return item.toString(ctx, onComment, onChompKeep);
        if (isAlias(item))
            return item.toString(ctx);
        let tagObj = undefined;
        const node = isNode(item)
            ? item
            : ctx.doc.createNode(item, { onTagObj: o => (tagObj = o) });
        if (!tagObj)
            tagObj = getTagObject(ctx.doc.schema.tags, node);
        const props = stringifyProps(node, tagObj, ctx);
        if (props.length > 0)
            ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
        const str = typeof tagObj.stringify === 'function'
            ? tagObj.stringify(node, ctx, onComment, onChompKeep)
            : isScalar(node)
                ? stringifyString(node, ctx, onComment, onChompKeep)
                : node.toString(ctx, onComment, onChompKeep);
        if (!props)
            return str;
        return isScalar(node) || str[0] === '{' || str[0] === '['
            ? `${props} ${str}`
            : `${props}\n${ctx.indent}${str}`;
    }

    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
        const { allNullValues, doc, indent, indentStep, options: { indentSeq, simpleKeys } } = ctx;
        let keyComment = (isNode(key) && key.comment) || null;
        if (simpleKeys) {
            if (keyComment) {
                throw new Error('With simple keys, key nodes cannot have comments');
            }
            if (isCollection(key)) {
                const msg = 'With simple keys, collection cannot be used as a key value';
                throw new Error(msg);
            }
        }
        let explicitKey = !simpleKeys &&
            (!key ||
                (keyComment && value == null && !ctx.inFlow) ||
                isCollection(key) ||
                (isScalar(key)
                    ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL
                    : typeof key === 'object'));
        ctx = Object.assign({}, ctx, {
            allNullValues: false,
            implicitKey: !explicitKey && (simpleKeys || !allNullValues),
            indent: indent + indentStep
        });
        let keyCommentDone = false;
        let chompKeep = false;
        let str = stringify(key, ctx, () => (keyCommentDone = true), () => (chompKeep = true));
        if (!explicitKey && !ctx.inFlow && str.length > 1024) {
            if (simpleKeys)
                throw new Error('With simple keys, single line scalar must not span more than 1024 characters');
            explicitKey = true;
        }
        if (ctx.inFlow) {
            if (allNullValues || value == null) {
                if (keyCommentDone && onComment)
                    onComment();
                return explicitKey ? `? ${str}` : str;
            }
        }
        else if ((allNullValues && !simpleKeys) || (value == null && explicitKey)) {
            if (keyCommentDone)
                keyComment = null;
            if (chompKeep && !keyComment && onChompKeep)
                onChompKeep();
            return addComment(`? ${str}`, ctx.indent, keyComment);
        }
        if (keyCommentDone)
            keyComment = null;
        str = explicitKey
            ? `? ${addComment(str, ctx.indent, keyComment)}\n${indent}:`
            : addComment(`${str}:`, ctx.indent, keyComment);
        let vcb = '';
        let valueComment = null;
        if (isNode(value)) {
            if (value.spaceBefore)
                vcb = '\n';
            if (value.commentBefore) {
                const cs = value.commentBefore.replace(/^/gm, `${ctx.indent}#`);
                vcb += `\n${cs}`;
            }
            valueComment = value.comment;
        }
        else if (value && typeof value === 'object') {
            value = doc.createNode(value);
        }
        ctx.implicitKey = false;
        if (!explicitKey && !keyComment && isScalar(value))
            ctx.indentAtStart = str.length + 1;
        chompKeep = false;
        if (!indentSeq &&
            indentStep.length >= 2 &&
            !ctx.inFlow &&
            !explicitKey &&
            isSeq(value) &&
            !value.flow &&
            !value.tag &&
            !value.anchor) {
            // If indentSeq === false, consider '- ' as part of indentation where possible
            ctx.indent = ctx.indent.substr(2);
        }
        let valueCommentDone = false;
        const valueStr = stringify(value, ctx, () => (valueCommentDone = true), () => (chompKeep = true));
        let ws = ' ';
        if (vcb || keyComment) {
            ws = `${vcb}\n${ctx.indent}`;
        }
        else if (!explicitKey && isCollection(value)) {
            const flow = valueStr[0] === '[' || valueStr[0] === '{';
            if (!flow || valueStr.includes('\n'))
                ws = `\n${ctx.indent}`;
        }
        else if (valueStr[0] === '\n')
            ws = '';
        if (ctx.inFlow) {
            if (valueCommentDone && onComment)
                onComment();
            return str + ws + valueStr;
        }
        else {
            if (valueCommentDone)
                valueComment = null;
            if (chompKeep && !valueComment && onChompKeep)
                onChompKeep();
            return addComment(str + ws + valueStr, ctx.indent, valueComment);
        }
    }

    function warn(logLevel, warning) {
        if (logLevel === 'debug' || logLevel === 'warn') {
            if (typeof process !== 'undefined' && process.emitWarning)
                process.emitWarning(warning);
            else
                console.warn(warning);
        }
    }

    const MERGE_KEY = '<<';
    function addPairToJSMap(ctx, map, { key, value }) {
        if (ctx && ctx.doc.schema.merge && isMergeKey(key)) {
            if (isSeq(value))
                for (const it of value.items)
                    mergeToJSMap(ctx, map, it);
            else if (Array.isArray(value))
                for (const it of value)
                    mergeToJSMap(ctx, map, it);
            else
                mergeToJSMap(ctx, map, value);
        }
        else {
            const jsKey = toJS(key, '', ctx);
            if (map instanceof Map) {
                map.set(jsKey, toJS(value, jsKey, ctx));
            }
            else if (map instanceof Set) {
                map.add(jsKey);
            }
            else {
                const stringKey = stringifyKey(key, jsKey, ctx);
                const jsValue = toJS(value, stringKey, ctx);
                if (stringKey in map)
                    Object.defineProperty(map, stringKey, {
                        value: jsValue,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                else
                    map[stringKey] = jsValue;
            }
        }
        return map;
    }
    const isMergeKey = (key) => key === MERGE_KEY ||
        (isScalar(key) &&
            key.value === MERGE_KEY &&
            (!key.type || key.type === Scalar.PLAIN));
    // If the value associated with a merge key is a single mapping node, each of
    // its key/value pairs is inserted into the current mapping, unless the key
    // already exists in it. If the value associated with the merge key is a
    // sequence, then this sequence is expected to contain mapping nodes and each
    // of these nodes is merged in turn according to its order in the sequence.
    // Keys in mapping nodes earlier in the sequence override keys specified in
    // later mapping nodes. -- http://yaml.org/type/merge.html
    function mergeToJSMap(ctx, map, value) {
        const source = ctx && isAlias(value) ? value.resolve(ctx.doc) : null;
        if (!isMap(source))
            throw new Error('Merge sources must be map aliases');
        const srcMap = source.toJSON(null, ctx, Map);
        for (const [key, value] of srcMap) {
            if (map instanceof Map) {
                if (!map.has(key))
                    map.set(key, value);
            }
            else if (map instanceof Set) {
                map.add(key);
            }
            else if (!Object.prototype.hasOwnProperty.call(map, key)) {
                Object.defineProperty(map, key, {
                    value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
        }
        return map;
    }
    function stringifyKey(key, jsKey, ctx) {
        if (jsKey === null)
            return '';
        if (typeof jsKey !== 'object')
            return String(jsKey);
        if (isNode(key) && ctx && ctx.doc) {
            const strCtx = createStringifyContext(ctx.doc, {});
            strCtx.anchors = new Set();
            for (const node of ctx.anchors.keys())
                strCtx.anchors.add(node.anchor);
            strCtx.inFlow = true;
            strCtx.inStringifyKey = true;
            const strKey = key.toString(strCtx);
            if (!ctx.mapKeyWarned) {
                let jsonStr = JSON.stringify(strKey);
                if (jsonStr.length > 40)
                    jsonStr = jsonStr.substring(0, 36) + '..."';
                warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
                ctx.mapKeyWarned = true;
            }
            return strKey;
        }
        return JSON.stringify(jsKey);
    }

    function createPair(key, value, ctx) {
        const k = createNode(key, undefined, ctx);
        const v = createNode(value, undefined, ctx);
        return new Pair(k, v);
    }
    class Pair {
        constructor(key, value = null) {
            Object.defineProperty(this, NODE_TYPE, { value: PAIR });
            this.key = key;
            this.value = value;
        }
        toJSON(_, ctx) {
            const pair = ctx && ctx.mapAsMap ? new Map() : {};
            return addPairToJSMap(ctx, pair, this);
        }
        toString(ctx, onComment, onChompKeep) {
            return ctx && ctx.doc
                ? stringifyPair(this, ctx, onComment, onChompKeep)
                : JSON.stringify(this);
        }
    }

    /**
     * `yaml` defines document-specific options in three places: as an argument of
     * parse, create and stringify calls, in the values of `YAML.defaultOptions`,
     * and in the version-dependent `YAML.Document.defaults` object. Values set in
     * `YAML.defaultOptions` override version-dependent defaults, and argument
     * options override both.
     */
    const defaultOptions = {
        intAsBigInt: false,
        logLevel: 'warn',
        prettyErrors: true,
        strict: true,
        version: '1.2'
    };

    function stringifyCollection({ comment, flow, items }, ctx, { blockItem, flowChars, itemIndent, onChompKeep, onComment }) {
        const { indent, indentStep } = ctx;
        const inFlow = flow || ctx.inFlow;
        if (inFlow)
            itemIndent += indentStep;
        ctx = Object.assign({}, ctx, { indent: itemIndent, inFlow, type: null });
        let singleLineOutput = true;
        let chompKeep = false; // flag for the preceding node's status
        const nodes = items.reduce((nodes, item, i) => {
            let comment = null;
            if (isNode(item)) {
                if (!chompKeep && item.spaceBefore)
                    nodes.push({ comment: true, str: '' });
                if (item.commentBefore) {
                    // This match will always succeed on a non-empty string
                    for (const line of item.commentBefore.match(/^.*$/gm))
                        nodes.push({ comment: true, str: `#${line}` });
                }
                if (item.comment) {
                    comment = item.comment;
                    singleLineOutput = false;
                }
            }
            else if (isPair(item)) {
                const ik = isNode(item.key) ? item.key : null;
                if (ik) {
                    if (!chompKeep && ik.spaceBefore)
                        nodes.push({ comment: true, str: '' });
                    if (ik.commentBefore) {
                        // This match will always succeed on a non-empty string
                        for (const line of ik.commentBefore.match(/^.*$/gm))
                            nodes.push({ comment: true, str: `#${line}` });
                    }
                    if (ik.comment)
                        singleLineOutput = false;
                }
                if (inFlow) {
                    const iv = isNode(item.value) ? item.value : null;
                    if (iv) {
                        if (iv.comment)
                            comment = iv.comment;
                        if (iv.comment || iv.commentBefore)
                            singleLineOutput = false;
                    }
                    else if (item.value == null && ik && ik.comment) {
                        comment = ik.comment;
                    }
                }
            }
            chompKeep = false;
            let str = stringify(item, ctx, () => (comment = null), () => (chompKeep = true));
            if (inFlow && i < items.length - 1)
                str += ',';
            str = addComment(str, itemIndent, comment);
            if (chompKeep && (comment || inFlow))
                chompKeep = false;
            nodes.push({ comment: false, str });
            return nodes;
        }, []);
        let str;
        if (nodes.length === 0) {
            str = flowChars.start + flowChars.end;
        }
        else if (inFlow) {
            const { start, end } = flowChars;
            const strings = nodes.map(n => n.str);
            let singleLineLength = 2;
            for (const node of nodes) {
                if (node.comment || node.str.includes('\n')) {
                    singleLineOutput = false;
                    break;
                }
                singleLineLength += node.str.length + 2;
            }
            if (!singleLineOutput ||
                singleLineLength > Collection.maxFlowStringSingleLineLength) {
                str = start;
                for (const s of strings) {
                    str += s ? `\n${indentStep}${indent}${s}` : '\n';
                }
                str += `\n${indent}${end}`;
            }
            else {
                str = `${start} ${strings.join(' ')} ${end}`;
            }
        }
        else {
            const strings = nodes.map(blockItem);
            str = strings.shift() || '';
            for (const s of strings)
                str += s ? `\n${indent}${s}` : '\n';
        }
        if (comment) {
            str += '\n' + comment.replace(/^/gm, `${indent}#`);
            if (onComment)
                onComment();
        }
        else if (chompKeep && onChompKeep)
            onChompKeep();
        return str;
    }

    function findPair(items, key) {
        const k = isScalar(key) ? key.value : key;
        for (const it of items) {
            if (isPair(it)) {
                if (it.key === key || it.key === k)
                    return it;
                if (isScalar(it.key) && it.key.value === k)
                    return it;
            }
        }
        return undefined;
    }
    class YAMLMap extends Collection {
        constructor(schema) {
            super(MAP, schema);
            this.items = [];
        }
        static get tagName() {
            return 'tag:yaml.org,2002:map';
        }
        /**
         * Adds a value to the collection.
         *
         * @param overwrite - If not set `true`, using a key that is already in the
         *   collection will throw. Otherwise, overwrites the previous value.
         */
        add(pair, overwrite) {
            let _pair;
            if (isPair(pair))
                _pair = pair;
            else if (!pair || typeof pair !== 'object' || !('key' in pair)) {
                // In TypeScript, this never happens.
                _pair = new Pair(pair, pair.value);
            }
            else
                _pair = new Pair(pair.key, pair.value);
            const prev = findPair(this.items, _pair.key);
            const sortEntries = this.schema && this.schema.sortMapEntries;
            if (prev) {
                if (!overwrite)
                    throw new Error(`Key ${_pair.key} already set`);
                // For scalars, keep the old node & its comments and anchors
                if (isScalar(prev.value) && isScalarValue(_pair.value))
                    prev.value.value = _pair.value;
                else
                    prev.value = _pair.value;
            }
            else if (sortEntries) {
                const i = this.items.findIndex(item => sortEntries(_pair, item) < 0);
                if (i === -1)
                    this.items.push(_pair);
                else
                    this.items.splice(i, 0, _pair);
            }
            else {
                this.items.push(_pair);
            }
        }
        delete(key) {
            const it = findPair(this.items, key);
            if (!it)
                return false;
            const del = this.items.splice(this.items.indexOf(it), 1);
            return del.length > 0;
        }
        get(key, keepScalar) {
            const it = findPair(this.items, key);
            const node = it && it.value;
            return !keepScalar && isScalar(node) ? node.value : node;
        }
        has(key) {
            return !!findPair(this.items, key);
        }
        set(key, value) {
            this.add(new Pair(key, value), true);
        }
        /**
         * @param ctx - Conversion context, originally set in Document#toJS()
         * @param {Class} Type - If set, forces the returned collection type
         * @returns Instance of Type, Map, or Object
         */
        toJSON(_, ctx, Type) {
            const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
            if (ctx && ctx.onCreate)
                ctx.onCreate(map);
            for (const item of this.items)
                addPairToJSMap(ctx, map, item);
            return map;
        }
        toString(ctx, onComment, onChompKeep) {
            if (!ctx)
                return JSON.stringify(this);
            for (const item of this.items) {
                if (!isPair(item))
                    throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
            }
            if (!ctx.allNullValues && this.hasAllNullValues(false))
                ctx = Object.assign({}, ctx, { allNullValues: true });
            return stringifyCollection(this, ctx, {
                blockItem: n => n.str,
                flowChars: { start: '{', end: '}' },
                itemIndent: ctx.indent || '',
                onChompKeep,
                onComment
            });
        }
    }

    function createMap(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new YAMLMap(schema);
        const add = (key, value) => {
            if (typeof replacer === 'function')
                value = replacer.call(obj, key, value);
            else if (Array.isArray(replacer) && !replacer.includes(key))
                return;
            if (value !== undefined || keepUndefined)
                map.items.push(createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
            for (const [key, value] of obj)
                add(key, value);
        }
        else if (obj && typeof obj === 'object') {
            for (const key of Object.keys(obj))
                add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === 'function') {
            map.items.sort(schema.sortMapEntries);
        }
        return map;
    }
    const map = {
        collection: 'map',
        createNode: createMap,
        default: true,
        nodeClass: YAMLMap,
        tag: 'tag:yaml.org,2002:map',
        resolve(map, onError) {
            if (!isMap(map))
                onError('Expected a mapping for this tag');
            return map;
        }
    };

    class YAMLSeq extends Collection {
        constructor(schema) {
            super(SEQ, schema);
            this.items = [];
        }
        static get tagName() {
            return 'tag:yaml.org,2002:seq';
        }
        add(value) {
            this.items.push(value);
        }
        /**
         * Removes a value from the collection.
         *
         * `key` must contain a representation of an integer for this to succeed.
         * It may be wrapped in a `Scalar`.
         *
         * @returns `true` if the item was found and removed.
         */
        delete(key) {
            const idx = asItemIndex(key);
            if (typeof idx !== 'number')
                return false;
            const del = this.items.splice(idx, 1);
            return del.length > 0;
        }
        /**
         * Returns item at `key`, or `undefined` if not found. By default unwraps
         * scalar values from their surrounding node; to disable set `keepScalar` to
         * `true` (collections are always returned intact).
         *
         * `key` must contain a representation of an integer for this to succeed.
         * It may be wrapped in a `Scalar`.
         */
        get(key, keepScalar) {
            const idx = asItemIndex(key);
            if (typeof idx !== 'number')
                return undefined;
            const it = this.items[idx];
            return !keepScalar && isScalar(it) ? it.value : it;
        }
        /**
         * Checks if the collection includes a value with the key `key`.
         *
         * `key` must contain a representation of an integer for this to succeed.
         * It may be wrapped in a `Scalar`.
         */
        has(key) {
            const idx = asItemIndex(key);
            return typeof idx === 'number' && idx < this.items.length;
        }
        /**
         * Sets a value in this collection. For `!!set`, `value` needs to be a
         * boolean to add/remove the item from the set.
         *
         * If `key` does not contain a representation of an integer, this will throw.
         * It may be wrapped in a `Scalar`.
         */
        set(key, value) {
            const idx = asItemIndex(key);
            if (typeof idx !== 'number')
                throw new Error(`Expected a valid index, not ${key}.`);
            const prev = this.items[idx];
            if (isScalar(prev) && isScalarValue(value))
                prev.value = value;
            else
                this.items[idx] = value;
        }
        toJSON(_, ctx) {
            const seq = [];
            if (ctx && ctx.onCreate)
                ctx.onCreate(seq);
            let i = 0;
            for (const item of this.items)
                seq.push(toJS(item, String(i++), ctx));
            return seq;
        }
        toString(ctx, onComment, onChompKeep) {
            if (!ctx)
                return JSON.stringify(this);
            return stringifyCollection(this, ctx, {
                blockItem: n => (n.comment ? n.str : `- ${n.str}`),
                flowChars: { start: '[', end: ']' },
                itemIndent: (ctx.indent || '') + '  ',
                onChompKeep,
                onComment
            });
        }
    }
    function asItemIndex(key) {
        let idx = isScalar(key) ? key.value : key;
        if (idx && typeof idx === 'string')
            idx = Number(idx);
        return typeof idx === 'number' && Number.isInteger(idx) && idx >= 0
            ? idx
            : null;
    }

    function createSeq(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new YAMLSeq(schema);
        if (obj && Symbol.iterator in Object(obj)) {
            let i = 0;
            for (let it of obj) {
                if (typeof replacer === 'function') {
                    const key = obj instanceof Set ? it : String(i++);
                    it = replacer.call(obj, key, it);
                }
                seq.items.push(createNode(it, undefined, ctx));
            }
        }
        return seq;
    }
    const seq = {
        collection: 'seq',
        createNode: createSeq,
        default: true,
        nodeClass: YAMLSeq,
        tag: 'tag:yaml.org,2002:seq',
        resolve(seq, onError) {
            if (!isSeq(seq))
                onError('Expected a sequence for this tag');
            return seq;
        }
    };

    const string = {
        identify: value => typeof value === 'string',
        default: true,
        tag: 'tag:yaml.org,2002:str',
        resolve: str => str,
        stringify(item, ctx, onComment, onChompKeep) {
            ctx = Object.assign({ actualString: true }, ctx);
            return stringifyString(item, ctx, onComment, onChompKeep);
        }
    };

    const nullTag = {
        identify: value => value == null,
        createNode: () => new Scalar(null),
        default: true,
        tag: 'tag:yaml.org,2002:null',
        test: /^(?:~|[Nn]ull|NULL)?$/,
        resolve: () => new Scalar(null),
        stringify: ({ source }, ctx) => source && nullTag.test.test(source) ? source : ctx.options.nullStr
    };

    const boolTag = {
        identify: value => typeof value === 'boolean',
        default: true,
        tag: 'tag:yaml.org,2002:bool',
        test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
        resolve: str => new Scalar(str[0] === 't' || str[0] === 'T'),
        stringify({ source, value }, ctx) {
            if (source && boolTag.test.test(source)) {
                const sv = source[0] === 't' || source[0] === 'T';
                if (value === sv)
                    return source;
            }
            return value ? ctx.options.trueStr : ctx.options.falseStr;
        }
    };

    function stringifyNumber({ format, minFractionDigits, tag, value }) {
        if (typeof value === 'bigint')
            return String(value);
        const num = typeof value === 'number' ? value : Number(value);
        if (!isFinite(num))
            return isNaN(num) ? '.nan' : num < 0 ? '-.inf' : '.inf';
        let n = JSON.stringify(value);
        if (!format &&
            minFractionDigits &&
            (!tag || tag === 'tag:yaml.org,2002:float') &&
            /^\d/.test(n)) {
            let i = n.indexOf('.');
            if (i < 0) {
                i = n.length;
                n += '.';
            }
            let d = minFractionDigits - (n.length - i - 1);
            while (d-- > 0)
                n += '0';
        }
        return n;
    }

    const floatNaN$1 = {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        test: /^(?:[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN))$/,
        resolve: str => str.slice(-3).toLowerCase() === 'nan'
            ? NaN
            : str[0] === '-'
                ? Number.NEGATIVE_INFINITY
                : Number.POSITIVE_INFINITY,
        stringify: stringifyNumber
    };
    const floatExp$1 = {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        format: 'EXP',
        test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
        resolve: str => parseFloat(str),
        stringify: ({ value }) => Number(value).toExponential()
    };
    const float$1 = {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
        resolve(str) {
            const node = new Scalar(parseFloat(str));
            const dot = str.indexOf('.');
            if (dot !== -1 && str[str.length - 1] === '0')
                node.minFractionDigits = str.length - dot - 1;
            return node;
        },
        stringify: stringifyNumber
    };

    const intIdentify$2 = (value) => typeof value === 'bigint' || Number.isInteger(value);
    const intResolve$1 = (str, offset, radix, { intAsBigInt }) => (intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix));
    function intStringify$1(node, radix, prefix) {
        const { value } = node;
        if (intIdentify$2(value) && value >= 0)
            return prefix + value.toString(radix);
        return stringifyNumber(node);
    }
    const intOct$1 = {
        identify: value => intIdentify$2(value) && value >= 0,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        format: 'OCT',
        test: /^0o[0-7]+$/,
        resolve: (str, _onError, opt) => intResolve$1(str, 2, 8, opt),
        stringify: node => intStringify$1(node, 8, '0o')
    };
    const int$1 = {
        identify: intIdentify$2,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        test: /^[-+]?[0-9]+$/,
        resolve: (str, _onError, opt) => intResolve$1(str, 0, 10, opt),
        stringify: stringifyNumber
    };
    const intHex$1 = {
        identify: value => intIdentify$2(value) && value >= 0,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        format: 'HEX',
        test: /^0x[0-9a-fA-F]+$/,
        resolve: (str, _onError, opt) => intResolve$1(str, 2, 16, opt),
        stringify: node => intStringify$1(node, 16, '0x')
    };

    const schema$2 = [
        map,
        seq,
        string,
        nullTag,
        boolTag,
        intOct$1,
        int$1,
        intHex$1,
        floatNaN$1,
        floatExp$1,
        float$1
    ];

    function intIdentify$1(value) {
        return typeof value === 'bigint' || Number.isInteger(value);
    }
    const stringifyJSON = ({ value }) => JSON.stringify(value);
    const jsonScalars = [
        {
            identify: value => typeof value === 'string',
            default: true,
            tag: 'tag:yaml.org,2002:str',
            resolve: str => str,
            stringify: stringifyJSON
        },
        {
            identify: value => value == null,
            createNode: () => new Scalar(null),
            default: true,
            tag: 'tag:yaml.org,2002:null',
            test: /^null$/,
            resolve: () => null,
            stringify: stringifyJSON
        },
        {
            identify: value => typeof value === 'boolean',
            default: true,
            tag: 'tag:yaml.org,2002:bool',
            test: /^true|false$/,
            resolve: str => str === 'true',
            stringify: stringifyJSON
        },
        {
            identify: intIdentify$1,
            default: true,
            tag: 'tag:yaml.org,2002:int',
            test: /^-?(?:0|[1-9][0-9]*)$/,
            resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
            stringify: ({ value }) => intIdentify$1(value) ? value.toString() : JSON.stringify(value)
        },
        {
            identify: value => typeof value === 'number',
            default: true,
            tag: 'tag:yaml.org,2002:float',
            test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
            resolve: str => parseFloat(str),
            stringify: stringifyJSON
        }
    ];
    const jsonError = {
        default: true,
        tag: '',
        test: /^/,
        resolve(str, onError) {
            onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
            return str;
        }
    };
    const schema$1 = [map, seq].concat(jsonScalars, jsonError);

    const binary = {
        identify: value => value instanceof Uint8Array,
        default: false,
        tag: 'tag:yaml.org,2002:binary',
        /**
         * Returns a Buffer in node and an Uint8Array in browsers
         *
         * To use the resulting buffer as an image, you'll want to do something like:
         *
         *   const blob = new Blob([buffer], { type: 'image/jpeg' })
         *   document.querySelector('#photo').src = URL.createObjectURL(blob)
         */
        resolve(src, onError) {
            if (typeof Buffer === 'function') {
                return Buffer.from(src, 'base64');
            }
            else if (typeof atob === 'function') {
                // On IE 11, atob() can't handle newlines
                const str = atob(src.replace(/[\n\r]/g, ''));
                const buffer = new Uint8Array(str.length);
                for (let i = 0; i < str.length; ++i)
                    buffer[i] = str.charCodeAt(i);
                return buffer;
            }
            else {
                onError('This environment does not support reading binary tags; either Buffer or atob is required');
                return src;
            }
        },
        stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
            const buf = value; // checked earlier by binary.identify()
            let str;
            if (typeof Buffer === 'function') {
                str =
                    buf instanceof Buffer
                        ? buf.toString('base64')
                        : Buffer.from(buf.buffer).toString('base64');
            }
            else if (typeof btoa === 'function') {
                let s = '';
                for (let i = 0; i < buf.length; ++i)
                    s += String.fromCharCode(buf[i]);
                str = btoa(s);
            }
            else {
                throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
            }
            if (!type)
                type = Scalar.BLOCK_LITERAL;
            if (type !== Scalar.QUOTE_DOUBLE) {
                const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
                const n = Math.ceil(str.length / lineWidth);
                const lines = new Array(n);
                for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
                    lines[i] = str.substr(o, lineWidth);
                }
                str = lines.join(type === Scalar.BLOCK_LITERAL ? '\n' : ' ');
            }
            return stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
        }
    };

    function resolvePairs(seq, onError) {
        if (isSeq(seq)) {
            for (let i = 0; i < seq.items.length; ++i) {
                let item = seq.items[i];
                if (isPair(item))
                    continue;
                else if (isMap(item)) {
                    if (item.items.length > 1)
                        onError('Each pair must have its own sequence indicator');
                    const pair = item.items[0] || new Pair(new Scalar(null));
                    if (item.commentBefore)
                        pair.key.commentBefore = pair.key.commentBefore
                            ? `${item.commentBefore}\n${pair.key.commentBefore}`
                            : item.commentBefore;
                    if (item.comment) {
                        const cn = pair.value || pair.key;
                        cn.comment = cn.comment
                            ? `${item.comment}\n${cn.comment}`
                            : item.comment;
                    }
                    item = pair;
                }
                seq.items[i] = isPair(item) ? item : new Pair(item);
            }
        }
        else
            onError('Expected a sequence for this tag');
        return seq;
    }
    function createPairs(schema, iterable, ctx) {
        const { replacer } = ctx;
        const pairs = new YAMLSeq(schema);
        pairs.tag = 'tag:yaml.org,2002:pairs';
        let i = 0;
        if (iterable && Symbol.iterator in Object(iterable))
            for (let it of iterable) {
                if (typeof replacer === 'function')
                    it = replacer.call(iterable, String(i++), it);
                let key, value;
                if (Array.isArray(it)) {
                    if (it.length === 2) {
                        key = it[0];
                        value = it[1];
                    }
                    else
                        throw new TypeError(`Expected [key, value] tuple: ${it}`);
                }
                else if (it && it instanceof Object) {
                    const keys = Object.keys(it);
                    if (keys.length === 1) {
                        key = keys[0];
                        value = it[key];
                    }
                    else
                        throw new TypeError(`Expected { key: value } tuple: ${it}`);
                }
                else {
                    key = it;
                }
                pairs.items.push(createPair(key, value, ctx));
            }
        return pairs;
    }
    const pairs = {
        collection: 'seq',
        default: false,
        tag: 'tag:yaml.org,2002:pairs',
        resolve: resolvePairs,
        createNode: createPairs
    };

    class YAMLOMap extends YAMLSeq {
        constructor() {
            super();
            this.add = YAMLMap.prototype.add.bind(this);
            this.delete = YAMLMap.prototype.delete.bind(this);
            this.get = YAMLMap.prototype.get.bind(this);
            this.has = YAMLMap.prototype.has.bind(this);
            this.set = YAMLMap.prototype.set.bind(this);
            this.tag = YAMLOMap.tag;
        }
        /**
         * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
         * but TypeScript won't allow widening the signature of a child method.
         */
        toJSON(_, ctx) {
            if (!ctx)
                return super.toJSON(_);
            const map = new Map();
            if (ctx && ctx.onCreate)
                ctx.onCreate(map);
            for (const pair of this.items) {
                let key, value;
                if (isPair(pair)) {
                    key = toJS(pair.key, '', ctx);
                    value = toJS(pair.value, key, ctx);
                }
                else {
                    key = toJS(pair, '', ctx);
                }
                if (map.has(key))
                    throw new Error('Ordered maps must not include duplicate keys');
                map.set(key, value);
            }
            return map;
        }
    }
    YAMLOMap.tag = 'tag:yaml.org,2002:omap';
    const omap = {
        collection: 'seq',
        identify: value => value instanceof Map,
        nodeClass: YAMLOMap,
        default: false,
        tag: 'tag:yaml.org,2002:omap',
        resolve(seq, onError) {
            const pairs = resolvePairs(seq, onError);
            const seenKeys = [];
            for (const { key } of pairs.items) {
                if (isScalar(key)) {
                    if (seenKeys.includes(key.value)) {
                        onError(`Ordered maps must not include duplicate keys: ${key.value}`);
                    }
                    else {
                        seenKeys.push(key.value);
                    }
                }
            }
            return Object.assign(new YAMLOMap(), pairs);
        },
        createNode(schema, iterable, ctx) {
            const pairs = createPairs(schema, iterable, ctx);
            const omap = new YAMLOMap();
            omap.items = pairs.items;
            return omap;
        }
    };

    function boolStringify({ value, source }, ctx) {
        const boolObj = value ? trueTag : falseTag;
        if (source && boolObj.test.test(source))
            return source;
        return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    const trueTag = {
        identify: value => value === true,
        default: true,
        tag: 'tag:yaml.org,2002:bool',
        test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
        resolve: () => new Scalar(true),
        stringify: boolStringify
    };
    const falseTag = {
        identify: value => value === false,
        default: true,
        tag: 'tag:yaml.org,2002:bool',
        test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
        resolve: () => new Scalar(false),
        stringify: boolStringify
    };

    const floatNaN = {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        test: /^[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN)$/,
        resolve: (str) => str.slice(-3).toLowerCase() === 'nan'
            ? NaN
            : str[0] === '-'
                ? Number.NEGATIVE_INFINITY
                : Number.POSITIVE_INFINITY,
        stringify: stringifyNumber
    };
    const floatExp = {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        format: 'EXP',
        test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
        resolve: (str) => parseFloat(str.replace(/_/g, '')),
        stringify: ({ value }) => Number(value).toExponential()
    };
    const float = {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
        resolve(str) {
            const node = new Scalar(parseFloat(str.replace(/_/g, '')));
            const dot = str.indexOf('.');
            if (dot !== -1) {
                const f = str.substring(dot + 1).replace(/_/g, '');
                if (f[f.length - 1] === '0')
                    node.minFractionDigits = f.length;
            }
            return node;
        },
        stringify: stringifyNumber
    };

    const intIdentify = (value) => typeof value === 'bigint' || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
        const sign = str[0];
        if (sign === '-' || sign === '+')
            offset += 1;
        str = str.substring(offset).replace(/_/g, '');
        if (intAsBigInt) {
            switch (radix) {
                case 2:
                    str = `0b${str}`;
                    break;
                case 8:
                    str = `0o${str}`;
                    break;
                case 16:
                    str = `0x${str}`;
                    break;
            }
            const n = BigInt(str);
            return sign === '-' ? BigInt(-1) * n : n;
        }
        const n = parseInt(str, radix);
        return sign === '-' ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
        const { value } = node;
        if (intIdentify(value)) {
            const str = value.toString(radix);
            return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
        }
        return stringifyNumber(node);
    }
    const intBin = {
        identify: intIdentify,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        format: 'BIN',
        test: /^[-+]?0b[0-1_]+$/,
        resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
        stringify: node => intStringify(node, 2, '0b')
    };
    const intOct = {
        identify: intIdentify,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        format: 'OCT',
        test: /^[-+]?0[0-7_]+$/,
        resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
        stringify: node => intStringify(node, 8, '0')
    };
    const int = {
        identify: intIdentify,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        test: /^[-+]?[0-9][0-9_]*$/,
        resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
        stringify: stringifyNumber
    };
    const intHex = {
        identify: intIdentify,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        format: 'HEX',
        test: /^[-+]?0x[0-9a-fA-F_]+$/,
        resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
        stringify: node => intStringify(node, 16, '0x')
    };

    class YAMLSet extends YAMLMap {
        constructor(schema) {
            super(schema);
            this.tag = YAMLSet.tag;
        }
        add(key) {
            let pair;
            if (isPair(key))
                pair = key;
            else if (typeof key === 'object' &&
                'key' in key &&
                'value' in key &&
                key.value === null)
                pair = new Pair(key.key, null);
            else
                pair = new Pair(key, null);
            const prev = findPair(this.items, pair.key);
            if (!prev)
                this.items.push(pair);
        }
        get(key, keepPair) {
            const pair = findPair(this.items, key);
            return !keepPair && isPair(pair)
                ? isScalar(pair.key)
                    ? pair.key.value
                    : pair.key
                : pair;
        }
        set(key, value) {
            if (typeof value !== 'boolean')
                throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
            const prev = findPair(this.items, key);
            if (prev && !value) {
                this.items.splice(this.items.indexOf(prev), 1);
            }
            else if (!prev && value) {
                this.items.push(new Pair(key));
            }
        }
        toJSON(_, ctx) {
            return super.toJSON(_, ctx, Set);
        }
        toString(ctx, onComment, onChompKeep) {
            if (!ctx)
                return JSON.stringify(this);
            if (this.hasAllNullValues(true))
                return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
            else
                throw new Error('Set items must all have null values');
        }
    }
    YAMLSet.tag = 'tag:yaml.org,2002:set';
    const set = {
        collection: 'map',
        identify: value => value instanceof Set,
        nodeClass: YAMLSet,
        default: false,
        tag: 'tag:yaml.org,2002:set',
        resolve(map, onError) {
            if (isMap(map)) {
                if (map.hasAllNullValues(true))
                    return Object.assign(new YAMLSet(), map);
                else
                    onError('Set items must all have null values');
            }
            else
                onError('Expected a mapping for this tag');
            return map;
        },
        createNode(schema, iterable, ctx) {
            const { replacer } = ctx;
            const set = new YAMLSet(schema);
            if (iterable && Symbol.iterator in Object(iterable))
                for (let value of iterable) {
                    if (typeof replacer === 'function')
                        value = replacer.call(iterable, value, value);
                    set.items.push(createPair(value, null, ctx));
                }
            return set;
        }
    };

    /** Internal types handle bigint as number, because TS can't figure it out. */
    function parseSexagesimal(str, asBigInt) {
        const sign = str[0];
        const parts = sign === '-' || sign === '+' ? str.substring(1) : str;
        const num = (n) => asBigInt ? BigInt(n) : Number(n);
        const res = parts
            .replace(/_/g, '')
            .split(':')
            .reduce((res, p) => res * num(60) + num(p), num(0));
        return (sign === '-' ? num(-1) * res : res);
    }
    /**
     * hhhh:mm:ss.sss
     *
     * Internal types handle bigint as number, because TS can't figure it out.
     */
    function stringifySexagesimal(node) {
        let { value } = node;
        let num = (n) => n;
        if (typeof value === 'bigint')
            num = n => BigInt(n);
        else if (isNaN(value) || !isFinite(value))
            return stringifyNumber(node);
        let sign = '';
        if (value < 0) {
            sign = '-';
            value *= num(-1);
        }
        const _60 = num(60);
        const parts = [value % _60]; // seconds, including ms
        if (value < 60) {
            parts.unshift(0); // at least one : is required
        }
        else {
            value = (value - parts[0]) / _60;
            parts.unshift(value % _60); // minutes
            if (value >= 60) {
                value = (value - parts[0]) / _60;
                parts.unshift(value); // hours
            }
        }
        return (sign +
            parts
                .map(n => (n < 10 ? '0' + String(n) : String(n)))
                .join(':')
                .replace(/000000\d*$/, '') // % 60 may introduce error
        );
    }
    const intTime = {
        identify: value => typeof value === 'bigint' || Number.isInteger(value),
        default: true,
        tag: 'tag:yaml.org,2002:int',
        format: 'TIME',
        test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
        resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
        stringify: stringifySexagesimal
    };
    const floatTime = {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        format: 'TIME',
        test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
        resolve: str => parseSexagesimal(str, false),
        stringify: stringifySexagesimal
    };
    const timestamp = {
        identify: value => value instanceof Date,
        default: true,
        tag: 'tag:yaml.org,2002:timestamp',
        // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
        // may be omitted altogether, resulting in a date format. In such a case, the time part is
        // assumed to be 00:00:00Z (start of day, UTC).
        test: RegExp('^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
            '(?:' + // time is optional
            '(?:t|T|[ \\t]+)' + // t | T | whitespace
            '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
            '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
            ')?$'),
        resolve(str) {
            const match = str.match(timestamp.test);
            if (!match)
                throw new Error('!!timestamp expects a date, starting with yyyy-mm-dd');
            const [, year, month, day, hour, minute, second] = match.map(Number);
            const millisec = match[7] ? Number((match[7] + '00').substr(1, 3)) : 0;
            let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
            const tz = match[8];
            if (tz && tz !== 'Z') {
                let d = parseSexagesimal(tz, false);
                if (Math.abs(d) < 30)
                    d *= 60;
                date -= 60000 * d;
            }
            return new Date(date);
        },
        stringify: ({ value }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
    };

    const schema = [
        map,
        seq,
        string,
        nullTag,
        trueTag,
        falseTag,
        intBin,
        intOct,
        int,
        intHex,
        floatNaN,
        floatExp,
        float,
        binary,
        omap,
        pairs,
        set,
        intTime,
        floatTime,
        timestamp
    ];

    const schemas = {
        core: schema$2,
        failsafe: [map, seq, string],
        json: schema$1,
        yaml11: schema,
        'yaml-1.1': schema
    };
    const tagsByName = {
        binary,
        bool: boolTag,
        float: float$1,
        floatExp: floatExp$1,
        floatNaN: floatNaN$1,
        floatTime,
        int: int$1,
        intHex: intHex$1,
        intOct: intOct$1,
        intTime,
        map,
        null: nullTag,
        omap,
        pairs,
        seq,
        set,
        timestamp
    };
    const coreKnownTags = {
        'tag:yaml.org,2002:binary': binary,
        'tag:yaml.org,2002:omap': omap,
        'tag:yaml.org,2002:pairs': pairs,
        'tag:yaml.org,2002:set': set,
        'tag:yaml.org,2002:timestamp': timestamp
    };
    function getTags(customTags, schemaName) {
        let tags = schemas[schemaName];
        if (!tags) {
            const keys = Object.keys(schemas)
                .filter(key => key !== 'yaml11')
                .map(key => JSON.stringify(key))
                .join(', ');
            throw new Error(`Unknown schema "${schemaName}"; use one of ${keys}`);
        }
        if (Array.isArray(customTags)) {
            for (const tag of customTags)
                tags = tags.concat(tag);
        }
        else if (typeof customTags === 'function') {
            tags = customTags(tags.slice());
        }
        return tags.map(tag => {
            if (typeof tag !== 'string')
                return tag;
            const tagObj = tagsByName[tag];
            if (tagObj)
                return tagObj;
            const keys = Object.keys(tagsByName)
                .map(key => JSON.stringify(key))
                .join(', ');
            throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
        });
    }

    const sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    class Schema {
        constructor({ customTags, merge, resolveKnownTags, schema, sortMapEntries }) {
            this.merge = !!merge;
            this.name = schema || 'core';
            this.knownTags = resolveKnownTags ? coreKnownTags : {};
            this.tags = getTags(customTags, this.name);
            Object.defineProperty(this, MAP, { value: map });
            Object.defineProperty(this, SCALAR$1, { value: string });
            Object.defineProperty(this, SEQ, { value: seq });
            // Used by createMap()
            this.sortMapEntries =
                sortMapEntries === true ? sortMapEntriesByKey : sortMapEntries || null;
        }
    }

    function stringifyDocument(doc, options) {
        const lines = [];
        let hasDirectives = options.directives === true;
        if (options.directives !== false) {
            const dir = doc.directives.toString(doc);
            if (dir) {
                lines.push(dir);
                hasDirectives = true;
            }
            else if (doc.directives.marker)
                hasDirectives = true;
        }
        if (hasDirectives)
            lines.push('---');
        if (doc.commentBefore) {
            if (lines.length !== 1)
                lines.unshift('');
            lines.unshift(doc.commentBefore.replace(/^/gm, '#'));
        }
        const ctx = createStringifyContext(doc, options);
        let chompKeep = false;
        let contentComment = null;
        if (doc.contents) {
            if (isNode(doc.contents)) {
                if (doc.contents.spaceBefore && hasDirectives)
                    lines.push('');
                if (doc.contents.commentBefore)
                    lines.push(doc.contents.commentBefore.replace(/^/gm, '#'));
                // top-level block scalars need to be indented if followed by a comment
                ctx.forceBlockIndent = !!doc.comment;
                contentComment = doc.contents.comment;
            }
            const onChompKeep = contentComment ? undefined : () => (chompKeep = true);
            let body = stringify(doc.contents, ctx, () => (contentComment = null), onChompKeep);
            if (contentComment)
                body = addComment(body, '', contentComment);
            if ((body[0] === '|' || body[0] === '>') &&
                lines[lines.length - 1] === '---') {
                // Top-level block scalars with a preceding doc marker ought to use the
                // same line for their header.
                lines[lines.length - 1] = `--- ${body}`;
            }
            else
                lines.push(body);
        }
        else {
            lines.push(stringify(doc.contents, ctx));
        }
        if (doc.comment) {
            if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '')
                lines.push('');
            lines.push(doc.comment.replace(/^/gm, '#'));
        }
        return lines.join('\n') + '\n';
    }

    /**
     * Applies the JSON.parse reviver algorithm as defined in the ECMA-262 spec,
     * in section 24.5.1.1 "Runtime Semantics: InternalizeJSONProperty" of the
     * 2021 edition: https://tc39.es/ecma262/#sec-json.parse
     *
     * Includes extensions for handling Map and Set objects.
     */
    function applyReviver(reviver, obj, key, val) {
        if (val && typeof val === 'object') {
            if (Array.isArray(val)) {
                for (let i = 0, len = val.length; i < len; ++i) {
                    const v0 = val[i];
                    const v1 = applyReviver(reviver, val, String(i), v0);
                    if (v1 === undefined)
                        delete val[i];
                    else if (v1 !== v0)
                        val[i] = v1;
                }
            }
            else if (val instanceof Map) {
                for (const k of Array.from(val.keys())) {
                    const v0 = val.get(k);
                    const v1 = applyReviver(reviver, val, k, v0);
                    if (v1 === undefined)
                        val.delete(k);
                    else if (v1 !== v0)
                        val.set(k, v1);
                }
            }
            else if (val instanceof Set) {
                for (const v0 of Array.from(val)) {
                    const v1 = applyReviver(reviver, val, v0, v0);
                    if (v1 === undefined)
                        val.delete(v0);
                    else if (v1 !== v0) {
                        val.delete(v0);
                        val.add(v1);
                    }
                }
            }
            else {
                for (const [k, v0] of Object.entries(val)) {
                    const v1 = applyReviver(reviver, val, k, v0);
                    if (v1 === undefined)
                        delete val[k];
                    else if (v1 !== v0)
                        val[k] = v1;
                }
            }
        }
        return reviver.call(obj, key, val);
    }

    class Document {
        constructor(value, replacer, options) {
            /** A comment before this Document */
            this.commentBefore = null;
            /** A comment immediately after this Document */
            this.comment = null;
            /** Errors encountered during parsing. */
            this.errors = [];
            /** Warnings encountered during parsing. */
            this.warnings = [];
            Object.defineProperty(this, NODE_TYPE, { value: DOC });
            let _replacer = null;
            if (typeof replacer === 'function' || Array.isArray(replacer)) {
                _replacer = replacer;
            }
            else if (options === undefined && replacer) {
                options = replacer;
                replacer = undefined;
            }
            const opt = Object.assign({}, defaultOptions, options);
            this.options = opt;
            let { version } = opt;
            if (options === null || options === void 0 ? void 0 : options.directives) {
                this.directives = options.directives.atDocument();
                if (this.directives.yaml.explicit)
                    version = this.directives.yaml.version;
            }
            else
                this.directives = new Directives({ version });
            this.setSchema(version, options);
            if (value === undefined)
                this.contents = null;
            else {
                this.contents = this.createNode(value, _replacer, options);
            }
        }
        /** Adds a value to the document. */
        add(value) {
            if (assertCollection(this.contents))
                this.contents.add(value);
        }
        /** Adds a value to the document. */
        addIn(path, value) {
            if (assertCollection(this.contents))
                this.contents.addIn(path, value);
        }
        /**
         * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
         *
         * If `node` already has an anchor, `name` is ignored.
         * Otherwise, the `node.anchor` value will be set to `name`,
         * or if an anchor with that name is already present in the document,
         * `name` will be used as a prefix for a new unique anchor.
         * If `name` is undefined, the generated anchor will use 'a' as a prefix.
         */
        createAlias(node, name) {
            if (!node.anchor) {
                const prev = anchorNames(this);
                node.anchor =
                    !name || prev.has(name) ? findNewAnchor(name || 'a', prev) : name;
            }
            return new Alias(node.anchor);
        }
        createNode(value, replacer, options) {
            let _replacer = undefined;
            if (typeof replacer === 'function') {
                value = replacer.call({ '': value }, '', value);
                _replacer = replacer;
            }
            else if (Array.isArray(replacer)) {
                const keyToStr = (v) => typeof v === 'number' || v instanceof String || v instanceof Number;
                const asStr = replacer.filter(keyToStr).map(String);
                if (asStr.length > 0)
                    replacer = replacer.concat(asStr);
                _replacer = replacer;
            }
            else if (options === undefined && replacer) {
                options = replacer;
                replacer = undefined;
            }
            const { anchorPrefix, flow, keepUndefined, onTagObj, tag } = options || {};
            const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(this, anchorPrefix || 'a');
            const ctx = {
                keepUndefined: keepUndefined !== null && keepUndefined !== void 0 ? keepUndefined : false,
                onAnchor,
                onTagObj,
                replacer: _replacer,
                schema: this.schema,
                sourceObjects
            };
            const node = createNode(value, tag, ctx);
            if (flow && isCollection(node))
                node.flow = true;
            setAnchors();
            return node;
        }
        /**
         * Convert a key and a value into a `Pair` using the current schema,
         * recursively wrapping all values as `Scalar` or `Collection` nodes.
         */
        createPair(key, value, options = {}) {
            const k = this.createNode(key, null, options);
            const v = this.createNode(value, null, options);
            return new Pair(k, v);
        }
        /**
         * Removes a value from the document.
         * @returns `true` if the item was found and removed.
         */
        delete(key) {
            return assertCollection(this.contents) ? this.contents.delete(key) : false;
        }
        /**
         * Removes a value from the document.
         * @returns `true` if the item was found and removed.
         */
        deleteIn(path) {
            if (isEmptyPath(path)) {
                if (this.contents == null)
                    return false;
                this.contents = null;
                return true;
            }
            return assertCollection(this.contents)
                ? this.contents.deleteIn(path)
                : false;
        }
        /**
         * Returns item at `key`, or `undefined` if not found. By default unwraps
         * scalar values from their surrounding node; to disable set `keepScalar` to
         * `true` (collections are always returned intact).
         */
        get(key, keepScalar) {
            return isCollection(this.contents)
                ? this.contents.get(key, keepScalar)
                : undefined;
        }
        /**
         * Returns item at `path`, or `undefined` if not found. By default unwraps
         * scalar values from their surrounding node; to disable set `keepScalar` to
         * `true` (collections are always returned intact).
         */
        getIn(path, keepScalar) {
            if (isEmptyPath(path))
                return !keepScalar && isScalar(this.contents)
                    ? this.contents.value
                    : this.contents;
            return isCollection(this.contents)
                ? this.contents.getIn(path, keepScalar)
                : undefined;
        }
        /**
         * Checks if the document includes a value with the key `key`.
         */
        has(key) {
            return isCollection(this.contents) ? this.contents.has(key) : false;
        }
        /**
         * Checks if the document includes a value at `path`.
         */
        hasIn(path) {
            if (isEmptyPath(path))
                return this.contents !== undefined;
            return isCollection(this.contents) ? this.contents.hasIn(path) : false;
        }
        /**
         * Sets a value in this document. For `!!set`, `value` needs to be a
         * boolean to add/remove the item from the set.
         */
        set(key, value) {
            if (this.contents == null) {
                this.contents = collectionFromPath(this.schema, [key], value);
            }
            else if (assertCollection(this.contents)) {
                this.contents.set(key, value);
            }
        }
        /**
         * Sets a value in this document. For `!!set`, `value` needs to be a
         * boolean to add/remove the item from the set.
         */
        setIn(path, value) {
            if (isEmptyPath(path))
                this.contents = value;
            else if (this.contents == null) {
                this.contents = collectionFromPath(this.schema, Array.from(path), value);
            }
            else if (assertCollection(this.contents)) {
                this.contents.setIn(path, value);
            }
        }
        /**
         * Change the YAML version and schema used by the document.
         *
         * Overrides all previously set schema options
         */
        setSchema(version, options) {
            let _options;
            switch (String(version)) {
                case '1.1':
                    this.directives.yaml.version = '1.1';
                    _options = Object.assign({ merge: true, resolveKnownTags: false, schema: 'yaml-1.1' }, options);
                    break;
                case '1.2':
                    this.directives.yaml.version = '1.2';
                    _options = Object.assign({ merge: false, resolveKnownTags: true, schema: 'core' }, options);
                    break;
                default: {
                    const sv = JSON.stringify(version);
                    throw new Error(`Expected '1.1' or '1.2' as version, but found: ${sv}`);
                }
            }
            this.schema = new Schema(_options);
        }
        // json & jsonArg are only used from toJSON()
        toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
            const ctx = {
                anchors: new Map(),
                doc: this,
                keep: !json,
                mapAsMap: mapAsMap === true,
                mapKeyWarned: false,
                maxAliasCount: typeof maxAliasCount === 'number' ? maxAliasCount : 100,
                stringify
            };
            const res = toJS(this.contents, jsonArg || '', ctx);
            if (typeof onAnchor === 'function')
                for (const { count, res } of ctx.anchors.values())
                    onAnchor(res, count);
            return typeof reviver === 'function'
                ? applyReviver(reviver, { '': res }, '', res)
                : res;
        }
        /**
         * A JSON representation of the document `contents`.
         *
         * @param jsonArg Used by `JSON.stringify` to indicate the array index or
         *   property name.
         */
        toJSON(jsonArg, onAnchor) {
            return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
        }
        /** A YAML representation of the document. */
        toString(options = {}) {
            if (this.errors.length > 0)
                throw new Error('Document with errors cannot be stringified');
            if ('indent' in options &&
                (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
                const s = JSON.stringify(options.indent);
                throw new Error(`"indent" option must be a positive integer, not ${s}`);
            }
            return stringifyDocument(this, options);
        }
    }
    function assertCollection(contents) {
        if (isCollection(contents))
            return true;
        throw new Error('Expected a YAML collection as document contents');
    }

    class YAMLError extends Error {
        constructor(name, pos, code, message) {
            super();
            this.name = name;
            this.code = code;
            this.message = message;
            this.pos = pos;
        }
    }
    class YAMLParseError extends YAMLError {
        constructor(pos, code, message) {
            super('YAMLParseError', pos, code, message);
        }
    }
    class YAMLWarning extends YAMLError {
        constructor(pos, code, message) {
            super('YAMLWarning', pos, code, message);
        }
    }
    const prettifyError = (src, lc) => (error) => {
        if (error.pos[0] === -1)
            return;
        error.linePos = error.pos.map(pos => lc.linePos(pos));
        const { line, col } = error.linePos[0];
        error.message += ` at line ${line}, column ${col}`;
        let ci = col - 1;
        let lineStr = src
            .substring(lc.lineStarts[line - 1], lc.lineStarts[line])
            .replace(/[\n\r]+$/, '');
        // Trim to max 80 chars, keeping col position near the middle
        if (ci >= 60 && lineStr.length > 80) {
            const trimStart = Math.min(ci - 39, lineStr.length - 79);
            lineStr = '…' + lineStr.substring(trimStart);
            ci -= trimStart - 1;
        }
        if (lineStr.length > 80)
            lineStr = lineStr.substring(0, 79) + '…';
        // Include previous line in context if pointing at line start
        if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
            // Regexp won't match if start is trimmed
            let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
            if (prev.length > 80)
                prev = prev.substring(0, 79) + '…\n';
            lineStr = prev + lineStr;
        }
        if (/[^ ]/.test(lineStr)) {
            let count = 1;
            const end = error.linePos[1];
            if (end && end.line === line && end.col > col) {
                count = Math.min(end.col - col, 80 - ci);
            }
            const pointer = ' '.repeat(ci) + '^'.repeat(count);
            error.message += `:\n\n${lineStr}\n${pointer}\n`;
        }
    };

    function resolveProps(tokens, { ctx, flow, indicator, offset, onError, startOnNewline }) {
        let spaceBefore = false;
        let atNewline = startOnNewline;
        let hasSpace = startOnNewline;
        let comment = '';
        let commentSep = '';
        let hasNewline = false;
        let anchor = null;
        let tag = null;
        let comma = null;
        let found = null;
        let start = null;
        for (const token of tokens) {
            switch (token.type) {
                case 'space':
                    // At the doc level, tabs at line start may be parsed
                    // as leading white space rather than indentation.
                    // In a flow collection, only the parser handles indent.
                    if (!flow &&
                        atNewline &&
                        indicator !== 'doc-start' &&
                        token.source[0] === '\t')
                        onError(token, 'TAB_AS_INDENT', 'Tabs are not allowed as indentation');
                    hasSpace = true;
                    break;
                case 'comment': {
                    if (ctx.options.strict && !hasSpace)
                        onError(token, 'COMMENT_SPACE', 'Comments must be separated from other tokens by white space characters');
                    const cb = token.source.substring(1);
                    if (!comment)
                        comment = cb;
                    else
                        comment += commentSep + cb;
                    commentSep = '';
                    break;
                }
                case 'newline':
                    if (atNewline && !comment)
                        spaceBefore = true;
                    atNewline = true;
                    hasNewline = true;
                    hasSpace = true;
                    commentSep += token.source;
                    break;
                case 'anchor':
                    if (anchor)
                        onError(token, 'MULTIPLE_ANCHORS', 'A node can have at most one anchor');
                    anchor = token;
                    if (start === null)
                        start = token.offset;
                    atNewline = false;
                    hasSpace = false;
                    break;
                case 'tag': {
                    if (tag)
                        onError(token, 'MULTIPLE_TAGS', 'A node can have at most one tag');
                    tag = token;
                    if (start === null)
                        start = token.offset;
                    atNewline = false;
                    hasSpace = false;
                    break;
                }
                case indicator:
                    // Could here handle preceding comments differently
                    if (anchor || tag)
                        onError(token, 'BAD_PROP_ORDER', `Anchors and tags must be after the ${token.source} indicator`);
                    found = token;
                    atNewline = false;
                    hasSpace = false;
                    break;
                case 'comma':
                    if (flow) {
                        if (comma)
                            onError(token, 'UNEXPECTED_TOKEN', `Unexpected , in ${flow}`);
                        comma = token;
                        atNewline = false;
                        hasSpace = false;
                        break;
                    }
                // else fallthrough
                default:
                    onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${token.type} token`);
                    atNewline = false;
                    hasSpace = false;
            }
        }
        const last = tokens[tokens.length - 1];
        const end = last ? last.offset + last.source.length : offset;
        return {
            comma,
            found,
            spaceBefore,
            comment,
            hasNewline,
            anchor,
            tag,
            end,
            start: start !== null && start !== void 0 ? start : end
        };
    }

    function containsNewline(key) {
        if (!key)
            return null;
        switch (key.type) {
            case 'alias':
            case 'scalar':
            case 'double-quoted-scalar':
            case 'single-quoted-scalar':
                if (key.source.includes('\n'))
                    return true;
                if (key.end)
                    for (const st of key.end)
                        if (st.type === 'newline')
                            return true;
                return false;
            case 'flow-collection':
                for (const it of key.items) {
                    for (const st of it.start)
                        if (st.type === 'newline')
                            return true;
                    if (it.sep)
                        for (const st of it.sep)
                            if (st.type === 'newline')
                                return true;
                    if (containsNewline(it.key) || containsNewline(it.value))
                        return true;
                }
                return false;
            default:
                return true;
        }
    }

    const startColMsg = 'All mapping items must start at the same column';
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError) {
        var _a;
        const map = new YAMLMap(ctx.schema);
        let offset = bm.offset;
        for (const { start, key, sep, value } of bm.items) {
            // key properties
            const keyProps = resolveProps(start, {
                ctx,
                indicator: 'explicit-key-ind',
                offset,
                onError,
                startOnNewline: true
            });
            const implicitKey = !keyProps.found;
            if (implicitKey) {
                if (key) {
                    if (key.type === 'block-seq')
                        onError(offset, 'BLOCK_AS_IMPLICIT_KEY', 'A block sequence may not be used as an implicit map key');
                    else if ('indent' in key && key.indent !== bm.indent)
                        onError(offset, 'BAD_INDENT', startColMsg);
                }
                if (!keyProps.anchor && !keyProps.tag && !sep) {
                    // TODO: assert being at last item?
                    if (keyProps.comment) {
                        if (map.comment)
                            map.comment += '\n' + keyProps.comment;
                        else
                            map.comment = keyProps.comment;
                    }
                    continue;
                }
            }
            else if (((_a = keyProps.found) === null || _a === void 0 ? void 0 : _a.indent) !== bm.indent)
                onError(offset, 'BAD_INDENT', startColMsg);
            if (implicitKey && containsNewline(key))
                onError(key, // checked by containsNewline()
                'MULTILINE_IMPLICIT_KEY', 'Implicit keys need to be on a single line');
            // key value
            const keyStart = keyProps.end;
            const keyNode = key
                ? composeNode(ctx, key, keyProps, onError)
                : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
            // value properties
            const valueProps = resolveProps(sep || [], {
                ctx,
                indicator: 'map-value-ind',
                offset: keyNode.range[2],
                onError,
                startOnNewline: !key || key.type === 'block-scalar'
            });
            offset = valueProps.end;
            if (valueProps.found) {
                if (implicitKey) {
                    if ((value === null || value === void 0 ? void 0 : value.type) === 'block-map' && !valueProps.hasNewline)
                        onError(offset, 'BLOCK_AS_IMPLICIT_KEY', 'Nested mappings are not allowed in compact mappings');
                    if (ctx.options.strict &&
                        keyProps.start < valueProps.found.offset - 1024)
                        onError(keyNode.range, 'KEY_OVER_1024_CHARS', 'The : indicator must be at most 1024 chars after the start of an implicit block mapping key');
                }
                // value value
                const valueNode = value
                    ? composeNode(ctx, value, valueProps, onError)
                    : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
                offset = valueNode.range[2];
                map.items.push(new Pair(keyNode, valueNode));
            }
            else {
                // key with no value
                if (implicitKey)
                    onError(keyNode.range, 'MISSING_CHAR', 'Implicit map keys need to be followed by map values');
                if (valueProps.comment) {
                    if (keyNode.comment)
                        keyNode.comment += '\n' + valueProps.comment;
                    else
                        keyNode.comment = valueProps.comment;
                }
                map.items.push(new Pair(keyNode));
            }
        }
        map.range = [bm.offset, offset, offset];
        return map;
    }

    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError) {
        const seq = new YAMLSeq(ctx.schema);
        let offset = bs.offset;
        for (const { start, value } of bs.items) {
            const props = resolveProps(start, {
                ctx,
                indicator: 'seq-item-ind',
                offset,
                onError,
                startOnNewline: true
            });
            offset = props.end;
            if (!props.found) {
                if (props.anchor || props.tag || value) {
                    if (value && value.type === 'block-seq')
                        onError(offset, 'BAD_INDENT', 'All sequence items must start at the same column');
                    else
                        onError(offset, 'MISSING_CHAR', 'Sequence item without - indicator');
                }
                else {
                    // TODO: assert being at last item?
                    if (props.comment)
                        seq.comment = props.comment;
                    continue;
                }
            }
            const node = value
                ? composeNode(ctx, value, props, onError)
                : composeEmptyNode(ctx, offset, start, null, props, onError);
            offset = node.range[2];
            seq.items.push(node);
        }
        seq.range = [bs.offset, offset, offset];
        return seq;
    }

    function resolveEnd(end, offset, reqSpace, onError) {
        let comment = '';
        if (end) {
            let hasSpace = false;
            let sep = '';
            for (const token of end) {
                const { source, type } = token;
                switch (type) {
                    case 'space':
                        hasSpace = true;
                        break;
                    case 'comment': {
                        if (reqSpace && !hasSpace)
                            onError(token, 'COMMENT_SPACE', 'Comments must be separated from other tokens by white space characters');
                        const cb = source.substring(1);
                        if (!comment)
                            comment = cb;
                        else
                            comment += sep + cb;
                        sep = '';
                        break;
                    }
                    case 'newline':
                        if (comment)
                            sep += source;
                        hasSpace = true;
                        break;
                    default:
                        onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${type} at node end`);
                }
                offset += source.length;
            }
        }
        return { comment, offset };
    }

    const blockMsg = 'Block collections are not allowed within flow collections';
    const isBlock = (token) => token && (token.type === 'block-map' || token.type === 'block-seq');
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError) {
        const isMap = fc.start.source === '{';
        const fcName = isMap ? 'flow map' : 'flow sequence';
        const coll = isMap
            ? new YAMLMap(ctx.schema)
            : new YAMLSeq(ctx.schema);
        coll.flow = true;
        let offset = fc.offset;
        for (let i = 0; i < fc.items.length; ++i) {
            const { start, key, sep, value } = fc.items[i];
            const props = resolveProps(start, {
                ctx,
                flow: fcName,
                indicator: 'explicit-key-ind',
                offset,
                onError,
                startOnNewline: false
            });
            if (!props.found) {
                if (!props.anchor && !props.tag && !sep && !value) {
                    if (i === 0 && props.comma)
                        onError(props.comma, 'UNEXPECTED_TOKEN', `Unexpected , in ${fcName}`);
                    else if (i < fc.items.length - 1)
                        onError(props.start, 'UNEXPECTED_TOKEN', `Unexpected empty item in ${fcName}`);
                    if (props.comment) {
                        if (coll.comment)
                            coll.comment += '\n' + props.comment;
                        else
                            coll.comment = props.comment;
                    }
                    continue;
                }
                if (!isMap && ctx.options.strict && containsNewline(key))
                    onError(key, // checked by containsNewline()
                    'MULTILINE_IMPLICIT_KEY', 'Implicit keys of flow sequence pairs need to be on a single line');
            }
            if (i === 0) {
                if (props.comma)
                    onError(props.comma, 'UNEXPECTED_TOKEN', `Unexpected , in ${fcName}`);
            }
            else {
                if (!props.comma)
                    onError(props.start, 'MISSING_CHAR', `Missing , between ${fcName} items`);
                if (props.comment) {
                    let prevItemComment = '';
                    loop: for (const st of start) {
                        switch (st.type) {
                            case 'comma':
                            case 'space':
                                break;
                            case 'comment':
                                prevItemComment = st.source.substring(1);
                                break loop;
                            default:
                                break loop;
                        }
                    }
                    if (prevItemComment) {
                        let prev = coll.items[coll.items.length - 1];
                        if (isPair(prev))
                            prev = prev.value || prev.key;
                        if (prev.comment)
                            prev.comment += '\n' + prevItemComment;
                        else
                            prev.comment = prevItemComment;
                        props.comment = props.comment.substring(prevItemComment.length + 1);
                    }
                }
            }
            if (!isMap && !sep && !props.found) {
                // item is a value in a seq
                // → key & sep are empty, start does not include ? or :
                const valueNode = value
                    ? composeNode(ctx, value, props, onError)
                    : composeEmptyNode(ctx, props.end, sep, null, props, onError);
                coll.items.push(valueNode);
                offset = valueNode.range[2];
                if (isBlock(value))
                    onError(valueNode.range, 'BLOCK_IN_FLOW', blockMsg);
            }
            else {
                // item is a key+value pair
                // key value
                const keyStart = props.end;
                const keyNode = key
                    ? composeNode(ctx, key, props, onError)
                    : composeEmptyNode(ctx, keyStart, start, null, props, onError);
                if (isBlock(key))
                    onError(keyNode.range, 'BLOCK_IN_FLOW', blockMsg);
                // value properties
                const valueProps = resolveProps(sep || [], {
                    ctx,
                    flow: fcName,
                    indicator: 'map-value-ind',
                    offset: keyNode.range[2],
                    onError,
                    startOnNewline: false
                });
                if (valueProps.found) {
                    if (!isMap && !props.found && ctx.options.strict) {
                        if (sep)
                            for (const st of sep) {
                                if (st === valueProps.found)
                                    break;
                                if (st.type === 'newline') {
                                    onError(st, 'MULTILINE_IMPLICIT_KEY', 'Implicit keys of flow sequence pairs need to be on a single line');
                                    break;
                                }
                            }
                        if (props.start < valueProps.found.offset - 1024)
                            onError(valueProps.found, 'KEY_OVER_1024_CHARS', 'The : indicator must be at most 1024 chars after the start of an implicit flow sequence key');
                    }
                }
                else if (value) {
                    if ('source' in value && value.source && value.source[0] === ':')
                        onError(value, 'MISSING_CHAR', `Missing space after : in ${fcName}`);
                    else
                        onError(valueProps.start, 'MISSING_CHAR', `Missing , or : between ${fcName} items`);
                }
                // value value
                const valueNode = value
                    ? composeNode(ctx, value, valueProps, onError)
                    : valueProps.found
                        ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError)
                        : null;
                if (valueNode) {
                    if (isBlock(value))
                        onError(valueNode.range, 'BLOCK_IN_FLOW', blockMsg);
                }
                else if (valueProps.comment) {
                    if (keyNode.comment)
                        keyNode.comment += '\n' + valueProps.comment;
                    else
                        keyNode.comment = valueProps.comment;
                }
                const pair = new Pair(keyNode, valueNode);
                if (isMap)
                    coll.items.push(pair);
                else {
                    const map = new YAMLMap(ctx.schema);
                    map.flow = true;
                    map.items.push(pair);
                    coll.items.push(map);
                }
                offset = valueNode ? valueNode.range[2] : valueProps.end;
            }
        }
        const expectedEnd = isMap ? '}' : ']';
        const [ce, ...ee] = fc.end;
        let cePos = offset;
        if (ce && ce.source === expectedEnd)
            cePos += ce.source.length;
        else {
            onError(offset + 1, 'MISSING_CHAR', `Expected ${fcName} to end with ${expectedEnd}`);
            if (ce && ce.source.length !== 1)
                ee.unshift(ce);
        }
        if (ee.length > 0) {
            const end = resolveEnd(ee, cePos, ctx.options.strict, onError);
            if (end.comment) {
                if (coll.comment)
                    coll.comment += '\n' + end.comment;
                else
                    coll.comment = end.comment;
            }
            coll.range = [fc.offset, cePos, end.offset];
        }
        else {
            coll.range = [fc.offset, cePos, cePos];
        }
        return coll;
    }

    function composeCollection(CN, ctx, token, tagToken, onError) {
        let coll;
        switch (token.type) {
            case 'block-map': {
                coll = resolveBlockMap(CN, ctx, token, onError);
                break;
            }
            case 'block-seq': {
                coll = resolveBlockSeq(CN, ctx, token, onError);
                break;
            }
            case 'flow-collection': {
                coll = resolveFlowCollection(CN, ctx, token, onError);
                break;
            }
        }
        if (!tagToken)
            return coll;
        const tagName = ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg));
        if (!tagName)
            return coll;
        // Cast needed due to: https://github.com/Microsoft/TypeScript/issues/3841
        const Coll = coll.constructor;
        if (tagName === '!' || tagName === Coll.tagName) {
            coll.tag = Coll.tagName;
            return coll;
        }
        const expType = isMap(coll) ? 'map' : 'seq';
        let tag = ctx.schema.tags.find(t => t.collection === expType && t.tag === tagName);
        if (!tag) {
            const kt = ctx.schema.knownTags[tagName];
            if (kt && kt.collection === expType) {
                ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
                tag = kt;
            }
            else {
                onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, true);
                coll.tag = tagName;
                return coll;
            }
        }
        const res = tag.resolve(coll, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg), ctx.options);
        const node = isNode(res)
            ? res
            : new Scalar(res);
        node.range = coll.range;
        node.tag = tagName;
        if (tag === null || tag === void 0 ? void 0 : tag.format)
            node.format = tag.format;
        return node;
    }

    function resolveBlockScalar(scalar, strict, onError) {
        const start = scalar.offset;
        const header = parseBlockScalarHeader(scalar, strict, onError);
        if (!header)
            return { value: '', type: null, comment: '', range: [start, start, start] };
        const type = header.mode === '>' ? Scalar.BLOCK_FOLDED : Scalar.BLOCK_LITERAL;
        const lines = scalar.source ? splitLines(scalar.source) : [];
        // determine the end of content & start of chomping
        let chompStart = lines.length;
        for (let i = lines.length - 1; i >= 0; --i) {
            const content = lines[i][1];
            if (content === '' || content === '\r')
                chompStart = i;
            else
                break;
        }
        // shortcut for empty contents
        if (!scalar.source || chompStart === 0) {
            const value = header.chomp === '+' ? lines.map(line => line[0]).join('\n') : '';
            let end = start + header.length;
            if (scalar.source)
                end += scalar.source.length;
            return { value, type, comment: header.comment, range: [start, end, end] };
        }
        // find the indentation level to trim from start
        let trimIndent = scalar.indent + header.indent;
        let offset = scalar.offset + header.length;
        let contentStart = 0;
        for (let i = 0; i < chompStart; ++i) {
            const [indent, content] = lines[i];
            if (content === '' || content === '\r') {
                if (header.indent === 0 && indent.length > trimIndent)
                    trimIndent = indent.length;
            }
            else {
                if (indent.length < trimIndent) {
                    const message = 'Block scalars with more-indented leading empty lines must use an explicit indentation indicator';
                    onError(offset + indent.length, 'MISSING_CHAR', message);
                }
                if (header.indent === 0)
                    trimIndent = indent.length;
                contentStart = i;
                break;
            }
            offset += indent.length + content.length + 1;
        }
        let value = '';
        let sep = '';
        let prevMoreIndented = false;
        // leading whitespace is kept intact
        for (let i = 0; i < contentStart; ++i)
            value += lines[i][0].slice(trimIndent) + '\n';
        for (let i = contentStart; i < chompStart; ++i) {
            let [indent, content] = lines[i];
            offset += indent.length + content.length + 1;
            const crlf = content[content.length - 1] === '\r';
            if (crlf)
                content = content.slice(0, -1);
            /* istanbul ignore if already caught in lexer */
            if (content && indent.length < trimIndent) {
                const src = header.indent
                    ? 'explicit indentation indicator'
                    : 'first line';
                const message = `Block scalar lines must not be less indented than their ${src}`;
                onError(offset - content.length - (crlf ? 2 : 1), 'BAD_INDENT', message);
                indent = '';
            }
            if (type === Scalar.BLOCK_LITERAL) {
                value += sep + indent.slice(trimIndent) + content;
                sep = '\n';
            }
            else if (indent.length > trimIndent || content[0] === '\t') {
                // more-indented content within a folded block
                if (sep === ' ')
                    sep = '\n';
                else if (!prevMoreIndented && sep === '\n')
                    sep = '\n\n';
                value += sep + indent.slice(trimIndent) + content;
                sep = '\n';
                prevMoreIndented = true;
            }
            else if (content === '') {
                // empty line
                if (sep === '\n')
                    value += '\n';
                else
                    sep = '\n';
            }
            else {
                value += sep + content;
                sep = ' ';
                prevMoreIndented = false;
            }
        }
        switch (header.chomp) {
            case '-':
                break;
            case '+':
                for (let i = chompStart; i < lines.length; ++i)
                    value += '\n' + lines[i][0].slice(trimIndent);
                if (value[value.length - 1] !== '\n')
                    value += '\n';
                break;
            default:
                value += '\n';
        }
        const end = start + header.length + scalar.source.length;
        return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
        /* istanbul ignore if should not happen */
        if (props[0].type !== 'block-scalar-header') {
            onError(props[0], 'IMPOSSIBLE', 'Block scalar header not found');
            return null;
        }
        const { source } = props[0];
        const mode = source[0];
        let indent = 0;
        let chomp = '';
        let error = -1;
        for (let i = 1; i < source.length; ++i) {
            const ch = source[i];
            if (!chomp && (ch === '-' || ch === '+'))
                chomp = ch;
            else {
                const n = Number(ch);
                if (!indent && n)
                    indent = n;
                else if (error === -1)
                    error = offset + i;
            }
        }
        if (error !== -1)
            onError(error, 'UNEXPECTED_TOKEN', `Block scalar header includes extra characters: ${source}`);
        let hasSpace = false;
        let comment = '';
        let length = source.length;
        for (let i = 1; i < props.length; ++i) {
            const token = props[i];
            switch (token.type) {
                case 'space':
                    hasSpace = true;
                // fallthrough
                case 'newline':
                    length += token.source.length;
                    break;
                case 'comment':
                    if (strict && !hasSpace) {
                        const message = 'Comments must be separated from other tokens by white space characters';
                        onError(token, 'COMMENT_SPACE', message);
                    }
                    length += token.source.length;
                    comment = token.source.substring(1);
                    break;
                case 'error':
                    onError(token, 'UNEXPECTED_TOKEN', token.message);
                    length += token.source.length;
                    break;
                /* istanbul ignore next should not happen */
                default: {
                    const message = `Unexpected token in block scalar header: ${token.type}`;
                    onError(token, 'UNEXPECTED_TOKEN', message);
                    const ts = token.source;
                    if (ts && typeof ts === 'string')
                        length += ts.length;
                }
            }
        }
        return { mode, indent, chomp, comment, length };
    }
    /** @returns Array of lines split up as `[indent, content]` */
    function splitLines(source) {
        const split = source.split(/\n( *)/);
        const first = split[0];
        const m = first.match(/^( *)/);
        const line0 = m && m[1] ? [m[1], first.slice(m[1].length)] : ['', first];
        const lines = [line0];
        for (let i = 1; i < split.length; i += 2)
            lines.push([split[i], split[i + 1]]);
        return lines;
    }

    function resolveFlowScalar(scalar, strict, onError) {
        const { offset, type, source, end } = scalar;
        let _type;
        let value;
        const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
        switch (type) {
            case 'scalar':
                _type = Scalar.PLAIN;
                value = plainValue(source, _onError);
                break;
            case 'single-quoted-scalar':
                _type = Scalar.QUOTE_SINGLE;
                value = singleQuotedValue(source, _onError);
                break;
            case 'double-quoted-scalar':
                _type = Scalar.QUOTE_DOUBLE;
                value = doubleQuotedValue(source, _onError);
                break;
            /* istanbul ignore next should not happen */
            default:
                onError(scalar, 'UNEXPECTED_TOKEN', `Expected a flow scalar value, but found: ${type}`);
                return {
                    value: '',
                    type: null,
                    comment: '',
                    range: [offset, offset + source.length, offset + source.length]
                };
        }
        const valueEnd = offset + source.length;
        const re = resolveEnd(end, valueEnd, strict, onError);
        return {
            value,
            type: _type,
            comment: re.comment,
            range: [offset, valueEnd, re.offset]
        };
    }
    function plainValue(source, onError) {
        let message = '';
        switch (source[0]) {
            /* istanbul ignore next should not happen */
            case '\t':
                message = 'Plain value cannot start with a tab character';
                break;
            case '|':
            case '>': {
                message = `Plain value cannot start with block scalar indicator ${source[0]}`;
                break;
            }
            case '@':
            case '`': {
                message = `Plain value cannot start with reserved character ${source[0]}`;
                break;
            }
        }
        if (message)
            onError(0, 'BAD_SCALAR_START', message);
        return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
        if (source[source.length - 1] !== "'" || source.length === 1)
            onError(source.length, 'MISSING_CHAR', "Missing closing 'quote");
        return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
        /**
         * The negative lookbehind here and in the `re` RegExp is to
         * prevent causing a polynomial search time in certain cases.
         *
         * The try-catch is for Safari, which doesn't support this yet:
         * https://caniuse.com/js-regexp-lookbehind
         */
        let first, line;
        try {
            first = new RegExp('(.*?)(?<![ \t])[ \t]*\r?\n', 'sy');
            line = new RegExp('[ \t]*(.*?)(?:(?<![ \t])[ \t]*)?\r?\n', 'sy');
        }
        catch (_) {
            first = /(.*?)[ \t]*\r?\n/sy;
            line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
        }
        let match = first.exec(source);
        if (!match)
            return source;
        let res = match[1];
        let sep = ' ';
        let pos = first.lastIndex;
        line.lastIndex = pos;
        while ((match = line.exec(source))) {
            if (match[1] === '') {
                if (sep === '\n')
                    res += sep;
                else
                    sep = '\n';
            }
            else {
                res += sep + match[1];
                sep = ' ';
            }
            pos = line.lastIndex;
        }
        const last = /[ \t]*(.*)/sy;
        last.lastIndex = pos;
        match = last.exec(source);
        return res + sep + ((match && match[1]) || '');
    }
    function doubleQuotedValue(source, onError) {
        let res = '';
        for (let i = 1; i < source.length - 1; ++i) {
            const ch = source[i];
            if (ch === '\r' && source[i + 1] === '\n')
                continue;
            if (ch === '\n') {
                const { fold, offset } = foldNewline(source, i);
                res += fold;
                i = offset;
            }
            else if (ch === '\\') {
                let next = source[++i];
                const cc = escapeCodes[next];
                if (cc)
                    res += cc;
                else if (next === '\n') {
                    // skip escaped newlines, but still trim the following line
                    next = source[i + 1];
                    while (next === ' ' || next === '\t')
                        next = source[++i + 1];
                }
                else if (next === 'x' || next === 'u' || next === 'U') {
                    const length = { x: 2, u: 4, U: 8 }[next];
                    res += parseCharCode(source, i + 1, length, onError);
                    i += length;
                }
                else {
                    const raw = source.substr(i - 1, 2);
                    onError(i - 1, 'BAD_DQ_ESCAPE', `Invalid escape sequence ${raw}`);
                    res += raw;
                }
            }
            else if (ch === ' ' || ch === '\t') {
                // trim trailing whitespace
                const wsStart = i;
                let next = source[i + 1];
                while (next === ' ' || next === '\t')
                    next = source[++i + 1];
                if (next !== '\n')
                    res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
            }
            else {
                res += ch;
            }
        }
        if (source[source.length - 1] !== '"' || source.length === 1)
            onError(source.length, 'MISSING_CHAR', 'Missing closing "quote');
        return res;
    }
    /**
     * Fold a single newline into a space, multiple newlines to N - 1 newlines.
     * Presumes `source[offset] === '\n'`
     */
    function foldNewline(source, offset) {
        let fold = '';
        let ch = source[offset + 1];
        while (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            if (ch === '\r' && source[offset + 2] !== '\n')
                break;
            if (ch === '\n')
                fold += '\n';
            offset += 1;
            ch = source[offset + 1];
        }
        if (!fold)
            fold = ' ';
        return { fold, offset };
    }
    const escapeCodes = {
        '0': '\0',
        a: '\x07',
        b: '\b',
        e: '\x1b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t',
        v: '\v',
        N: '\u0085',
        _: '\u00a0',
        L: '\u2028',
        P: '\u2029',
        ' ': ' ',
        '"': '"',
        '/': '/',
        '\\': '\\',
        '\t': '\t'
    };
    function parseCharCode(source, offset, length, onError) {
        const cc = source.substr(offset, length);
        const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
        const code = ok ? parseInt(cc, 16) : NaN;
        if (isNaN(code)) {
            const raw = source.substr(offset - 2, length + 2);
            onError(offset - 2, 'BAD_DQ_ESCAPE', `Invalid escape sequence ${raw}`);
            return raw;
        }
        return String.fromCodePoint(code);
    }

    function composeScalar(ctx, token, tagToken, onError) {
        const { value, type, comment, range } = token.type === 'block-scalar'
            ? resolveBlockScalar(token, ctx.options.strict, onError)
            : resolveFlowScalar(token, ctx.options.strict, onError);
        const tagName = tagToken
            ? ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg))
            : null;
        const tag = tagToken && tagName
            ? findScalarTagByName(ctx.schema, value, tagName, tagToken, onError)
            : findScalarTagByTest(ctx.schema, value, token.type === 'scalar');
        let scalar;
        try {
            const res = tag.resolve(value, msg => onError(tagToken || token, 'TAG_RESOLVE_FAILED', msg), ctx.options);
            scalar = isScalar(res) ? res : new Scalar(res);
        }
        catch (error) {
            onError(tagToken || token, 'TAG_RESOLVE_FAILED', error.message);
            scalar = new Scalar(value);
        }
        scalar.range = range;
        scalar.source = value;
        if (type)
            scalar.type = type;
        if (tagName)
            scalar.tag = tagName;
        if (tag.format)
            scalar.format = tag.format;
        if (comment)
            scalar.comment = comment;
        return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
        var _a;
        if (tagName === '!')
            return schema[SCALAR$1]; // non-specific tag
        const matchWithTest = [];
        for (const tag of schema.tags) {
            if (!tag.collection && tag.tag === tagName) {
                if (tag.default && tag.test)
                    matchWithTest.push(tag);
                else
                    return tag;
            }
        }
        for (const tag of matchWithTest)
            if ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(value))
                return tag;
        const kt = schema.knownTags[tagName];
        if (kt && !kt.collection) {
            // Ensure that the known tag is available for stringifying,
            // but does not get used by default.
            schema.tags.push(Object.assign({}, kt, { default: false, test: undefined }));
            return kt;
        }
        onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, tagName !== 'tag:yaml.org,2002:str');
        return schema[SCALAR$1];
    }
    function findScalarTagByTest(schema, value, apply) {
        var _a;
        if (apply) {
            for (const tag of schema.tags) {
                if (tag.default && ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(value)))
                    return tag;
            }
        }
        return schema[SCALAR$1];
    }

    function emptyScalarPosition(offset, before, pos) {
        if (before) {
            if (pos === null)
                pos = before.length;
            for (let i = pos - 1; i >= 0; --i) {
                let st = before[i];
                switch (st.type) {
                    case 'space':
                    case 'comment':
                    case 'newline':
                        offset -= st.source.length;
                        continue;
                }
                // Technically, an empty scalar is immediately after the last non-empty
                // node, but it's more useful to place it after any whitespace.
                st = before[++i];
                while ((st === null || st === void 0 ? void 0 : st.type) === 'space') {
                    offset += st.source.length;
                    st = before[++i];
                }
                break;
            }
        }
        return offset;
    }

    const CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
        const { spaceBefore, comment, anchor, tag } = props;
        let node;
        switch (token.type) {
            case 'alias':
                node = composeAlias(ctx, token, onError);
                if (anchor || tag)
                    onError(token, 'ALIAS_PROPS', 'An alias node must not specify any properties');
                break;
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
            case 'block-scalar':
                node = composeScalar(ctx, token, tag, onError);
                if (anchor)
                    node.anchor = anchor.source.substring(1);
                break;
            case 'block-map':
            case 'block-seq':
            case 'flow-collection':
                node = composeCollection(CN, ctx, token, tag, onError);
                if (anchor)
                    node.anchor = anchor.source.substring(1);
                break;
            default:
                console.log(token);
                throw new Error(`Unsupporten token type: ${token.type}`);
        }
        if (spaceBefore)
            node.spaceBefore = true;
        if (comment) {
            if (token.type === 'scalar' && token.source === '')
                node.comment = comment;
            else
                node.commentBefore = comment;
        }
        return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag }, onError) {
        const token = {
            type: 'scalar',
            offset: emptyScalarPosition(offset, before, pos),
            indent: -1,
            source: ''
        };
        const node = composeScalar(ctx, token, tag, onError);
        if (anchor)
            node.anchor = anchor.source.substring(1);
        if (spaceBefore)
            node.spaceBefore = true;
        if (comment)
            node.comment = comment;
        return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
        const alias = new Alias(source.substring(1));
        const valueEnd = offset + source.length;
        const re = resolveEnd(end, valueEnd, options.strict, onError);
        alias.range = [offset, valueEnd, re.offset];
        if (re.comment)
            alias.comment = re.comment;
        return alias;
    }

    function composeDoc(options, directives, { offset, start, value, end }, onError) {
        const opts = Object.assign({ directives }, options);
        const doc = new Document(undefined, opts);
        const ctx = {
            directives: doc.directives,
            options: doc.options,
            schema: doc.schema
        };
        const props = resolveProps(start, {
            ctx,
            indicator: 'doc-start',
            offset,
            onError,
            startOnNewline: true
        });
        if (props.found) {
            doc.directives.marker = true;
            if (value &&
                (value.type === 'block-map' || value.type === 'block-seq') &&
                !props.hasNewline)
                onError(props.end, 'MISSING_CHAR', 'Block collection cannot start on same line with directives-end marker');
        }
        doc.contents = value
            ? composeNode(ctx, value, props, onError)
            : composeEmptyNode(ctx, props.end, start, null, props, onError);
        const contentEnd = doc.contents.range[2];
        const re = resolveEnd(end, contentEnd, false, onError);
        if (re.comment)
            doc.comment = re.comment;
        doc.range = [offset, contentEnd, re.offset];
        return doc;
    }

    function getErrorPos(src) {
        if (typeof src === 'number')
            return [src, src + 1];
        if (Array.isArray(src))
            return src.length === 2 ? src : [src[0], src[1]];
        const { offset, source } = src;
        return [offset, offset + (typeof source === 'string' ? source.length : 1)];
    }
    function parsePrelude(prelude) {
        let comment = '';
        let atComment = false;
        let afterEmptyLine = false;
        for (let i = 0; i < prelude.length; ++i) {
            const source = prelude[i];
            switch (source[0]) {
                case '#':
                    comment +=
                        (comment === '' ? '' : afterEmptyLine ? '\n\n' : '\n') +
                            source.substring(1);
                    atComment = true;
                    afterEmptyLine = false;
                    break;
                case '%':
                    if (prelude[i + 1][0] !== '#')
                        i += 1;
                    atComment = false;
                    break;
                default:
                    // This may be wrong after doc-end, but in that case it doesn't matter
                    if (!atComment)
                        afterEmptyLine = true;
                    atComment = false;
            }
        }
        return { comment, afterEmptyLine };
    }
    /**
     * Compose a stream of CST nodes into a stream of YAML Documents.
     *
     * ```ts
     * import { Composer, Parser } from 'yaml'
     *
     * const src: string = ...
     * const tokens = new Parser().parse(src)
     * const docs = new Composer().compose(tokens)
     * ```
     */
    class Composer {
        constructor(options = {}) {
            this.doc = null;
            this.atDirectives = false;
            this.prelude = [];
            this.errors = [];
            this.warnings = [];
            this.onError = (source, code, message, warning) => {
                const pos = getErrorPos(source);
                if (warning)
                    this.warnings.push(new YAMLWarning(pos, code, message));
                else
                    this.errors.push(new YAMLParseError(pos, code, message));
            };
            this.directives = new Directives({
                version: options.version || defaultOptions.version
            });
            this.options = options;
        }
        decorate(doc, afterDoc) {
            const { comment, afterEmptyLine } = parsePrelude(this.prelude);
            //console.log({ dc: doc.comment, prelude, comment })
            if (comment) {
                const dc = doc.contents;
                if (afterDoc) {
                    doc.comment = doc.comment ? `${doc.comment}\n${comment}` : comment;
                }
                else if (afterEmptyLine || doc.directives.marker || !dc) {
                    doc.commentBefore = comment;
                }
                else if (isCollection(dc) && !dc.flow && dc.items.length > 0) {
                    let it = dc.items[0];
                    if (isPair(it))
                        it = it.key;
                    const cb = it.commentBefore;
                    it.commentBefore = cb ? `${comment}\n${cb}` : comment;
                }
                else {
                    const cb = dc.commentBefore;
                    dc.commentBefore = cb ? `${comment}\n${cb}` : comment;
                }
            }
            if (afterDoc) {
                Array.prototype.push.apply(doc.errors, this.errors);
                Array.prototype.push.apply(doc.warnings, this.warnings);
            }
            else {
                doc.errors = this.errors;
                doc.warnings = this.warnings;
            }
            this.prelude = [];
            this.errors = [];
            this.warnings = [];
        }
        /**
         * Current stream status information.
         *
         * Mostly useful at the end of input for an empty stream.
         */
        streamInfo() {
            return {
                comment: parsePrelude(this.prelude).comment,
                directives: this.directives,
                errors: this.errors,
                warnings: this.warnings
            };
        }
        /**
         * Compose tokens into documents.
         *
         * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
         * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
         */
        *compose(tokens, forceDoc = false, endOffset = -1) {
            for (const token of tokens)
                yield* this.next(token);
            yield* this.end(forceDoc, endOffset);
        }
        /** Advance the composer by one CST token. */
        *next(token) {
            switch (token.type) {
                case 'directive':
                    this.directives.add(token.source, (offset, message, warning) => {
                        const pos = getErrorPos(token);
                        pos[0] += offset;
                        this.onError(pos, 'BAD_DIRECTIVE', message, warning);
                    });
                    this.prelude.push(token.source);
                    this.atDirectives = true;
                    break;
                case 'document': {
                    const doc = composeDoc(this.options, this.directives, token, this.onError);
                    if (this.atDirectives && !doc.directives.marker)
                        this.onError(token, 'MISSING_CHAR', 'Missing directives-end indicator line');
                    this.decorate(doc, false);
                    if (this.doc)
                        yield this.doc;
                    this.doc = doc;
                    this.atDirectives = false;
                    break;
                }
                case 'byte-order-mark':
                case 'space':
                    break;
                case 'comment':
                case 'newline':
                    this.prelude.push(token.source);
                    break;
                case 'error': {
                    const msg = token.source
                        ? `${token.message}: ${JSON.stringify(token.source)}`
                        : token.message;
                    const error = new YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', msg);
                    if (this.atDirectives || !this.doc)
                        this.errors.push(error);
                    else
                        this.doc.errors.push(error);
                    break;
                }
                case 'doc-end': {
                    if (!this.doc) {
                        const msg = 'Unexpected doc-end without preceding document';
                        this.errors.push(new YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', msg));
                        break;
                    }
                    const end = resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
                    this.decorate(this.doc, true);
                    if (end.comment) {
                        const dc = this.doc.comment;
                        this.doc.comment = dc ? `${dc}\n${end.comment}` : end.comment;
                    }
                    this.doc.range[2] = end.offset;
                    break;
                }
                default:
                    this.errors.push(new YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', `Unsupported token ${token.type}`));
            }
        }
        /**
         * Call at end of input to yield any remaining document.
         *
         * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
         * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
         */
        *end(forceDoc = false, endOffset = -1) {
            if (this.doc) {
                this.decorate(this.doc, true);
                yield this.doc;
                this.doc = null;
            }
            else if (forceDoc) {
                const opts = Object.assign({ directives: this.directives }, this.options);
                const doc = new Document(undefined, opts);
                if (this.atDirectives)
                    this.onError(endOffset, 'MISSING_CHAR', 'Missing directives-end indicator line');
                doc.range = [0, endOffset, endOffset];
                this.decorate(doc, false);
                yield doc;
            }
        }
    }

    /** The byte order mark */
    const BOM = '\u{FEFF}';
    /** Start of doc-mode */
    const DOCUMENT = '\x02'; // C0: Start of Text
    /** Unexpected end of flow-mode */
    const FLOW_END = '\x18'; // C0: Cancel
    /** Next token is a scalar value */
    const SCALAR = '\x1f'; // C0: Unit Separator
    /** Identify the type of a lexer token. May return `null` for unknown tokens. */
    function tokenType(source) {
        switch (source) {
            case BOM:
                return 'byte-order-mark';
            case DOCUMENT:
                return 'doc-mode';
            case FLOW_END:
                return 'flow-error-end';
            case SCALAR:
                return 'scalar';
            case '---':
                return 'doc-start';
            case '...':
                return 'doc-end';
            case '':
            case '\n':
            case '\r\n':
                return 'newline';
            case '-':
                return 'seq-item-ind';
            case '?':
                return 'explicit-key-ind';
            case ':':
                return 'map-value-ind';
            case '{':
                return 'flow-map-start';
            case '}':
                return 'flow-map-end';
            case '[':
                return 'flow-seq-start';
            case ']':
                return 'flow-seq-end';
            case ',':
                return 'comma';
        }
        switch (source[0]) {
            case ' ':
            case '\t':
                return 'space';
            case '#':
                return 'comment';
            case '%':
                return 'directive-line';
            case '*':
                return 'alias';
            case '&':
                return 'anchor';
            case '!':
                return 'tag';
            case "'":
                return 'single-quoted-scalar';
            case '"':
                return 'double-quoted-scalar';
            case '|':
            case '>':
                return 'block-scalar-header';
        }
        return null;
    }

    /*
    START -> stream

    stream
      directive -> line-end -> stream
      indent + line-end -> stream
      [else] -> line-start

    line-end
      comment -> line-end
      newline -> .
      input-end -> END

    line-start
      doc-start -> doc
      doc-end -> stream
      [else] -> indent -> block-start

    block-start
      seq-item-start -> block-start
      explicit-key-start -> block-start
      map-value-start -> block-start
      [else] -> doc

    doc
      line-end -> line-start
      spaces -> doc
      anchor -> doc
      tag -> doc
      flow-start -> flow -> doc
      flow-end -> error -> doc
      seq-item-start -> error -> doc
      explicit-key-start -> error -> doc
      map-value-start -> doc
      alias -> doc
      quote-start -> quoted-scalar -> doc
      block-scalar-header -> line-end -> block-scalar(min) -> line-start
      [else] -> plain-scalar(false, min) -> doc

    flow
      line-end -> flow
      spaces -> flow
      anchor -> flow
      tag -> flow
      flow-start -> flow -> flow
      flow-end -> .
      seq-item-start -> error -> flow
      explicit-key-start -> flow
      map-value-start -> flow
      alias -> flow
      quote-start -> quoted-scalar -> flow
      comma -> flow
      [else] -> plain-scalar(true, 0) -> flow

    quoted-scalar
      quote-end -> .
      [else] -> quoted-scalar

    block-scalar(min)
      newline + peek(indent < min) -> .
      [else] -> block-scalar(min)

    plain-scalar(is-flow, min)
      scalar-end(is-flow) -> .
      peek(newline + (indent < min)) -> .
      [else] -> plain-scalar(min)
    */
    function isEmpty(ch) {
        switch (ch) {
            case undefined:
            case ' ':
            case '\n':
            case '\r':
            case '\t':
                return true;
            default:
                return false;
        }
    }
    const invalidFlowScalarChars = [',', '[', ']', '{', '}'];
    const invalidIdentifierChars = [' ', ',', '[', ']', '{', '}', '\n', '\r', '\t'];
    const isNotIdentifierChar = (ch) => !ch || invalidIdentifierChars.includes(ch);
    /**
     * Splits an input string into lexical tokens, i.e. smaller strings that are
     * easily identifiable by `tokens.tokenType()`.
     *
     * Lexing starts always in a "stream" context. Incomplete input may be buffered
     * until a complete token can be emitted.
     *
     * In addition to slices of the original input, the following control characters
     * may also be emitted:
     *
     * - `\x02` (Start of Text): A document starts with the next token
     * - `\x18` (Cancel): Unexpected end of flow-mode (indicates an error)
     * - `\x1f` (Unit Separator): Next token is a scalar value
     * - `\u{FEFF}` (Byte order mark): Emitted separately outside documents
     */
    class Lexer {
        constructor() {
            /**
             * Flag indicating whether the end of the current buffer marks the end of
             * all input
             */
            this.atEnd = false;
            /**
             * Explicit indent set in block scalar header, as an offset from the current
             * minimum indent, so e.g. set to 1 from a header `|2+`. Set to -1 if not
             * explicitly set.
             */
            this.blockScalarIndent = -1;
            /**
             * Block scalars that include a + (keep) chomping indicator in their header
             * include trailing empty lines, which are otherwise excluded from the
             * scalar's contents.
             */
            this.blockScalarKeep = false;
            /** Current input */
            this.buffer = '';
            /**
             * Flag noting whether the map value indicator : can immediately follow this
             * node within a flow context.
             */
            this.flowKey = false;
            /** Count of surrounding flow collection levels. */
            this.flowLevel = 0;
            /**
             * Minimum level of indentation required for next lines to be parsed as a
             * part of the current scalar value.
             */
            this.indentNext = 0;
            /** Indentation level of the current line. */
            this.indentValue = 0;
            /** Stores the state of the lexer if reaching the end of incpomplete input */
            this.next = null;
            /** A pointer to `buffer`; the current position of the lexer. */
            this.pos = 0;
        }
        /**
         * Generate YAML tokens from the `source` string. If `incomplete`,
         * a part of the last line may be left as a buffer for the next call.
         *
         * @returns A generator of lexical tokens
         */
        *lex(source, incomplete = false) {
            if (source)
                this.buffer = this.buffer ? this.buffer + source : source;
            this.atEnd = !incomplete;
            let next = this.next || 'stream';
            while (next && (incomplete || this.hasChars(1)))
                next = yield* this.parseNext(next);
        }
        atLineEnd() {
            let i = this.pos;
            let ch = this.buffer[i];
            while (ch === ' ' || ch === '\t')
                ch = this.buffer[++i];
            if (!ch || ch === '#' || ch === '\n')
                return true;
            if (ch === '\r')
                return this.buffer[i + 1] === '\n';
            return false;
        }
        charAt(n) {
            return this.buffer[this.pos + n];
        }
        continueScalar(offset) {
            let ch = this.buffer[offset];
            if (this.indentNext > 0) {
                let indent = 0;
                while (ch === ' ')
                    ch = this.buffer[++indent + offset];
                if (ch === '\r') {
                    const next = this.buffer[indent + offset + 1];
                    if (next === '\n' || (!next && !this.atEnd))
                        return offset + indent + 1;
                }
                return ch === '\n' || indent >= this.indentNext || (!ch && !this.atEnd)
                    ? offset + indent
                    : -1;
            }
            if (ch === '-' || ch === '.') {
                const dt = this.buffer.substr(offset, 3);
                if ((dt === '---' || dt === '...') && isEmpty(this.buffer[offset + 3]))
                    return -1;
            }
            return offset;
        }
        getLine() {
            let end = this.buffer.indexOf('\n', this.pos);
            if (end === -1)
                return this.atEnd ? this.buffer.substring(this.pos) : null;
            if (this.buffer[end - 1] === '\r')
                end -= 1;
            return this.buffer.substring(this.pos, end);
        }
        hasChars(n) {
            return this.pos + n <= this.buffer.length;
        }
        setNext(state) {
            this.buffer = this.buffer.substring(this.pos);
            this.pos = 0;
            this.next = state;
            return null;
        }
        peek(n) {
            return this.buffer.substr(this.pos, n);
        }
        *parseNext(next) {
            switch (next) {
                case 'stream':
                    return yield* this.parseStream();
                case 'line-start':
                    return yield* this.parseLineStart();
                case 'block-start':
                    return yield* this.parseBlockStart();
                case 'doc':
                    return yield* this.parseDocument();
                case 'flow':
                    return yield* this.parseFlowCollection();
                case 'quoted-scalar':
                    return yield* this.parseQuotedScalar();
                case 'block-scalar':
                    return yield* this.parseBlockScalar();
                case 'plain-scalar':
                    return yield* this.parsePlainScalar();
            }
        }
        *parseStream() {
            let line = this.getLine();
            if (line === null)
                return this.setNext('stream');
            if (line[0] === BOM) {
                yield* this.pushCount(1);
                line = line.substring(1);
            }
            if (line[0] === '%') {
                let dirEnd = line.length;
                const cs = line.indexOf('#');
                if (cs !== -1) {
                    const ch = line[cs - 1];
                    if (ch === ' ' || ch === '\t')
                        dirEnd = cs - 1;
                }
                while (true) {
                    const ch = line[dirEnd - 1];
                    if (ch === ' ' || ch === '\t')
                        dirEnd -= 1;
                    else
                        break;
                }
                const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
                yield* this.pushCount(line.length - n); // possible comment
                this.pushNewline();
                return 'stream';
            }
            if (this.atLineEnd()) {
                const sp = yield* this.pushSpaces(true);
                yield* this.pushCount(line.length - sp);
                yield* this.pushNewline();
                return 'stream';
            }
            yield DOCUMENT;
            return yield* this.parseLineStart();
        }
        *parseLineStart() {
            const ch = this.charAt(0);
            if (!ch && !this.atEnd)
                return this.setNext('line-start');
            if (ch === '-' || ch === '.') {
                if (!this.atEnd && !this.hasChars(4))
                    return this.setNext('line-start');
                const s = this.peek(3);
                if (s === '---' && isEmpty(this.charAt(3))) {
                    yield* this.pushCount(3);
                    this.indentValue = 0;
                    this.indentNext = 0;
                    return 'doc';
                }
                else if (s === '...' && isEmpty(this.charAt(3))) {
                    yield* this.pushCount(3);
                    return 'stream';
                }
            }
            this.indentValue = yield* this.pushSpaces(false);
            if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
                this.indentNext = this.indentValue;
            return yield* this.parseBlockStart();
        }
        *parseBlockStart() {
            const [ch0, ch1] = this.peek(2);
            if (!ch1 && !this.atEnd)
                return this.setNext('block-start');
            if ((ch0 === '-' || ch0 === '?' || ch0 === ':') && isEmpty(ch1)) {
                const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
                this.indentNext = this.indentValue + 1;
                this.indentValue += n;
                return yield* this.parseBlockStart();
            }
            return 'doc';
        }
        *parseDocument() {
            yield* this.pushSpaces(true);
            const line = this.getLine();
            if (line === null)
                return this.setNext('doc');
            let n = yield* this.pushIndicators();
            switch (line[n]) {
                case '#':
                    yield* this.pushCount(line.length - n);
                // fallthrough
                case undefined:
                    yield* this.pushNewline();
                    return yield* this.parseLineStart();
                case '{':
                case '[':
                    yield* this.pushCount(1);
                    this.flowKey = false;
                    this.flowLevel = 1;
                    return 'flow';
                case '}':
                case ']':
                    // this is an error
                    yield* this.pushCount(1);
                    return 'doc';
                case '*':
                    yield* this.pushUntil(isNotIdentifierChar);
                    return 'doc';
                case '"':
                case "'":
                    return yield* this.parseQuotedScalar();
                case '|':
                case '>':
                    n += yield* this.parseBlockScalarHeader();
                    n += yield* this.pushSpaces(true);
                    yield* this.pushCount(line.length - n);
                    yield* this.pushNewline();
                    return yield* this.parseBlockScalar();
                default:
                    return yield* this.parsePlainScalar();
            }
        }
        *parseFlowCollection() {
            let nl, sp;
            let indent = -1;
            do {
                nl = yield* this.pushNewline();
                sp = yield* this.pushSpaces(true);
                if (nl > 0)
                    this.indentValue = indent = sp;
            } while (nl + sp > 0);
            const line = this.getLine();
            if (line === null)
                return this.setNext('flow');
            if ((indent !== -1 && indent < this.indentNext) ||
                (indent === 0 &&
                    (line.startsWith('---') || line.startsWith('...')) &&
                    isEmpty(line[3]))) {
                // Allowing for the terminal ] or } at the same (rather than greater)
                // indent level as the initial [ or { is technically invalid, but
                // failing here would be surprising to users.
                const atFlowEndMarker = indent === this.indentNext - 1 &&
                    this.flowLevel === 1 &&
                    (line[0] === ']' || line[0] === '}');
                if (!atFlowEndMarker) {
                    // this is an error
                    this.flowLevel = 0;
                    yield FLOW_END;
                    return yield* this.parseLineStart();
                }
            }
            let n = 0;
            while (line[n] === ',')
                n += (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
            n += yield* this.pushIndicators();
            switch (line[n]) {
                case undefined:
                    return 'flow';
                case '#':
                    yield* this.pushCount(line.length - n);
                    return 'flow';
                case '{':
                case '[':
                    yield* this.pushCount(1);
                    this.flowKey = false;
                    this.flowLevel += 1;
                    return 'flow';
                case '}':
                case ']':
                    yield* this.pushCount(1);
                    this.flowKey = true;
                    this.flowLevel -= 1;
                    return this.flowLevel ? 'flow' : 'doc';
                case '*':
                    yield* this.pushUntil(isNotIdentifierChar);
                    return 'flow';
                case '"':
                case "'":
                    this.flowKey = true;
                    return yield* this.parseQuotedScalar();
                case ':': {
                    const next = this.charAt(1);
                    if (this.flowKey || isEmpty(next) || next === ',') {
                        yield* this.pushCount(1);
                        yield* this.pushSpaces(true);
                        return 'flow';
                    }
                }
                // fallthrough
                default:
                    this.flowKey = false;
                    return yield* this.parsePlainScalar();
            }
        }
        *parseQuotedScalar() {
            const quote = this.charAt(0);
            let end = this.buffer.indexOf(quote, this.pos + 1);
            if (quote === "'") {
                while (end !== -1 && this.buffer[end + 1] === "'")
                    end = this.buffer.indexOf("'", end + 2);
            }
            else {
                // double-quote
                while (end !== -1) {
                    let n = 0;
                    while (this.buffer[end - 1 - n] === '\\')
                        n += 1;
                    if (n % 2 === 0)
                        break;
                    end = this.buffer.indexOf('"', end + 1);
                }
            }
            let nl = this.buffer.indexOf('\n', this.pos);
            if (nl !== -1 && nl < end) {
                while (nl !== -1 && nl < end) {
                    const cs = this.continueScalar(nl + 1);
                    if (cs === -1)
                        break;
                    nl = this.buffer.indexOf('\n', cs);
                }
                if (nl !== -1 && nl < end) {
                    // this is an error caused by an unexpected unindent
                    end = nl - 1;
                }
            }
            if (end === -1) {
                if (!this.atEnd)
                    return this.setNext('quoted-scalar');
                end = this.buffer.length;
            }
            yield* this.pushToIndex(end + 1, false);
            return this.flowLevel ? 'flow' : 'doc';
        }
        *parseBlockScalarHeader() {
            this.blockScalarIndent = -1;
            this.blockScalarKeep = false;
            let i = this.pos;
            while (true) {
                const ch = this.buffer[++i];
                if (ch === '+')
                    this.blockScalarKeep = true;
                else if (ch > '0' && ch <= '9')
                    this.blockScalarIndent = Number(ch) - 1;
                else if (ch !== '-')
                    break;
            }
            return yield* this.pushUntil(ch => isEmpty(ch) || ch === '#');
        }
        *parseBlockScalar() {
            let nl = this.pos - 1; // may be -1 if this.pos === 0
            let indent = 0;
            let ch;
            loop: for (let i = this.pos; (ch = this.buffer[i]); ++i) {
                switch (ch) {
                    case ' ':
                        indent += 1;
                        break;
                    case '\n':
                        nl = i;
                        indent = 0;
                        break;
                    case '\r': {
                        const next = this.buffer[i + 1];
                        if (!next && !this.atEnd)
                            return this.setNext('block-scalar');
                        if (next === '\n')
                            break;
                    } // fallthrough
                    default:
                        break loop;
                }
            }
            if (!ch && !this.atEnd)
                return this.setNext('block-scalar');
            if (indent >= this.indentNext) {
                if (this.blockScalarIndent === -1)
                    this.indentNext = indent;
                else
                    this.indentNext += this.blockScalarIndent;
                do {
                    const cs = this.continueScalar(nl + 1);
                    if (cs === -1)
                        break;
                    nl = this.buffer.indexOf('\n', cs);
                } while (nl !== -1);
                if (nl === -1) {
                    if (!this.atEnd)
                        return this.setNext('block-scalar');
                    nl = this.buffer.length;
                }
            }
            if (!this.blockScalarKeep) {
                do {
                    let i = nl - 1;
                    let ch = this.buffer[i];
                    if (ch === '\r')
                        ch = this.buffer[--i];
                    while (ch === ' ' || ch === '\t')
                        ch = this.buffer[--i];
                    if (ch === '\n' && i >= this.pos)
                        nl = i;
                    else
                        break;
                } while (true);
            }
            yield SCALAR;
            yield* this.pushToIndex(nl + 1, true);
            return yield* this.parseLineStart();
        }
        *parsePlainScalar() {
            const inFlow = this.flowLevel > 0;
            let end = this.pos - 1;
            let i = this.pos - 1;
            let ch;
            while ((ch = this.buffer[++i])) {
                if (ch === ':') {
                    const next = this.buffer[i + 1];
                    if (isEmpty(next) || (inFlow && next === ','))
                        break;
                    end = i;
                }
                else if (isEmpty(ch)) {
                    const next = this.buffer[i + 1];
                    if (next === '#' || (inFlow && invalidFlowScalarChars.includes(next)))
                        break;
                    if (ch === '\r') {
                        if (next === '\n') {
                            i += 1;
                            ch = '\n';
                        }
                        else
                            end = i;
                    }
                    if (ch === '\n') {
                        const cs = this.continueScalar(i + 1);
                        if (cs === -1)
                            break;
                        i = Math.max(i, cs - 2); // to advance, but still account for ' #'
                    }
                }
                else {
                    if (inFlow && invalidFlowScalarChars.includes(ch))
                        break;
                    end = i;
                }
            }
            if (!ch && !this.atEnd)
                return this.setNext('plain-scalar');
            yield SCALAR;
            yield* this.pushToIndex(end + 1, true);
            return inFlow ? 'flow' : 'doc';
        }
        *pushCount(n) {
            if (n > 0) {
                yield this.buffer.substr(this.pos, n);
                this.pos += n;
                return n;
            }
            return 0;
        }
        *pushToIndex(i, allowEmpty) {
            const s = this.buffer.slice(this.pos, i);
            if (s) {
                yield s;
                this.pos += s.length;
                return s.length;
            }
            else if (allowEmpty)
                yield '';
            return 0;
        }
        *pushIndicators() {
            switch (this.charAt(0)) {
                case '!':
                    if (this.charAt(1) === '<')
                        return ((yield* this.pushVerbatimTag()) +
                            (yield* this.pushSpaces(true)) +
                            (yield* this.pushIndicators()));
                // fallthrough
                case '&':
                    return ((yield* this.pushUntil(isNotIdentifierChar)) +
                        (yield* this.pushSpaces(true)) +
                        (yield* this.pushIndicators()));
                case ':':
                case '?': // this is an error outside flow collections
                case '-': // this is an error
                    if (isEmpty(this.charAt(1))) {
                        if (this.flowLevel === 0)
                            this.indentNext = this.indentValue + 1;
                        return ((yield* this.pushCount(1)) +
                            (yield* this.pushSpaces(true)) +
                            (yield* this.pushIndicators()));
                    }
            }
            return 0;
        }
        *pushVerbatimTag() {
            let i = this.pos + 2;
            let ch = this.buffer[i];
            while (!isEmpty(ch) && ch !== '>')
                ch = this.buffer[++i];
            return yield* this.pushToIndex(ch === '>' ? i + 1 : i, false);
        }
        *pushNewline() {
            const ch = this.buffer[this.pos];
            if (ch === '\n')
                return yield* this.pushCount(1);
            else if (ch === '\r' && this.charAt(1) === '\n')
                return yield* this.pushCount(2);
            else
                return 0;
        }
        *pushSpaces(allowTabs) {
            let i = this.pos - 1;
            let ch;
            do {
                ch = this.buffer[++i];
            } while (ch === ' ' || (allowTabs && ch === '\t'));
            const n = i - this.pos;
            if (n > 0) {
                yield this.buffer.substr(this.pos, n);
                this.pos = i;
            }
            return n;
        }
        *pushUntil(test) {
            let i = this.pos;
            let ch = this.buffer[i];
            while (!test(ch))
                ch = this.buffer[++i];
            return yield* this.pushToIndex(i, false);
        }
    }

    /**
     * Tracks newlines during parsing in order to provide an efficient API for
     * determining the one-indexed `{ line, col }` position for any offset
     * within the input.
     */
    class LineCounter {
        constructor() {
            this.lineStarts = [];
            /**
             * Should be called in ascending order. Otherwise, call
             * `lineCounter.lineStarts.sort()` before calling `linePos()`.
             */
            this.addNewLine = (offset) => this.lineStarts.push(offset);
            /**
             * Performs a binary search and returns the 1-indexed { line, col }
             * position of `offset`. If `line === 0`, `addNewLine` has never been
             * called or `offset` is before the first known newline.
             */
            this.linePos = (offset) => {
                let low = 0;
                let high = this.lineStarts.length;
                while (low < high) {
                    const mid = (low + high) >> 1; // Math.floor((low + high) / 2)
                    if (this.lineStarts[mid] < offset)
                        low = mid + 1;
                    else
                        high = mid;
                }
                if (this.lineStarts[low] === offset)
                    return { line: low + 1, col: 1 };
                if (low === 0)
                    return { line: 0, col: offset };
                const start = this.lineStarts[low - 1];
                return { line: low, col: offset - start + 1 };
            };
        }
    }

    function includesToken(list, type) {
        for (let i = 0; i < list.length; ++i)
            if (list[i].type === type)
                return true;
        return false;
    }
    function includesNonEmpty(list) {
        for (let i = 0; i < list.length; ++i) {
            switch (list[i].type) {
                case 'space':
                case 'comment':
                case 'newline':
                    break;
                default:
                    return true;
            }
        }
        return false;
    }
    function atFirstEmptyLineAfterComments(start) {
        let hasComment = false;
        for (let i = 0; i < start.length; ++i) {
            switch (start[i].type) {
                case 'space':
                    break;
                case 'comment':
                    hasComment = true;
                    break;
                case 'newline':
                    if (!hasComment)
                        return false;
                    break;
                default:
                    return false;
            }
        }
        if (hasComment) {
            for (let i = start.length - 1; i >= 0; --i) {
                switch (start[i].type) {
                    /* istanbul ignore next */
                    case 'space':
                        break;
                    case 'newline':
                        return true;
                    default:
                        return false;
                }
            }
        }
        return false;
    }
    function isFlowToken(token) {
        switch (token === null || token === void 0 ? void 0 : token.type) {
            case 'alias':
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
            case 'flow-collection':
                return true;
            default:
                return false;
        }
    }
    function getPrevProps(parent) {
        switch (parent.type) {
            case 'document':
                return parent.start;
            case 'block-map': {
                const it = parent.items[parent.items.length - 1];
                return it.sep || it.start;
            }
            case 'block-seq':
                return parent.items[parent.items.length - 1].start;
            /* istanbul ignore next should not happen */
            default:
                return [];
        }
    }
    /** Note: May modify input array */
    function getFirstKeyStartProps(prev) {
        var _a;
        if (prev.length === 0)
            return [];
        let i = prev.length;
        loop: while (--i >= 0) {
            switch (prev[i].type) {
                case 'doc-start':
                case 'explicit-key-ind':
                case 'map-value-ind':
                case 'seq-item-ind':
                case 'newline':
                    break loop;
            }
        }
        while (((_a = prev[++i]) === null || _a === void 0 ? void 0 : _a.type) === 'space') {
            /* loop */
        }
        return prev.splice(i, prev.length);
    }
    function fixFlowSeqItems(fc) {
        if (fc.start.type === 'flow-seq-start') {
            for (const it of fc.items) {
                if (it.sep &&
                    !it.value &&
                    !includesToken(it.start, 'explicit-key-ind') &&
                    !includesToken(it.sep, 'map-value-ind')) {
                    if (it.key)
                        it.value = it.key;
                    delete it.key;
                    if (isFlowToken(it.value)) {
                        if (it.value.end)
                            Array.prototype.push.apply(it.value.end, it.sep);
                        else
                            it.value.end = it.sep;
                    }
                    else
                        Array.prototype.push.apply(it.start, it.sep);
                    delete it.sep;
                }
            }
        }
    }
    /**
     * A YAML concrete syntax tree (CST) parser
     *
     * ```ts
     * const src: string = ...
     * for (const token of new Parser().parse(src)) {
     *   // token: Token
     * }
     * ```
     *
     * To use the parser with a user-provided lexer:
     *
     * ```ts
     * function* parse(source: string, lexer: Lexer) {
     *   const parser = new Parser()
     *   for (const lexeme of lexer.lex(source))
     *     yield* parser.next(lexeme)
     *   yield* parser.end()
     * }
     *
     * const src: string = ...
     * const lexer = new Lexer()
     * for (const token of parse(src, lexer)) {
     *   // token: Token
     * }
     * ```
     */
    class Parser {
        /**
         * @param onNewLine - If defined, called separately with the start position of
         *   each new line (in `parse()`, including the start of input).
         */
        constructor(onNewLine) {
            /** If true, space and sequence indicators count as indentation */
            this.atNewLine = true;
            /** If true, next token is a scalar value */
            this.atScalar = false;
            /** Current indentation level */
            this.indent = 0;
            /** Current offset since the start of parsing */
            this.offset = 0;
            /** On the same line with a block map key */
            this.onKeyLine = false;
            /** Top indicates the node that's currently being built */
            this.stack = [];
            /** The source of the current token, set in parse() */
            this.source = '';
            /** The type of the current token, set in parse() */
            this.type = '';
            // Must be defined after `next()`
            this.lexer = new Lexer();
            this.onNewLine = onNewLine;
        }
        /**
         * Parse `source` as a YAML stream.
         * If `incomplete`, a part of the last line may be left as a buffer for the next call.
         *
         * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
         *
         * @returns A generator of tokens representing each directive, document, and other structure.
         */
        *parse(source, incomplete = false) {
            if (this.onNewLine && this.offset === 0)
                this.onNewLine(0);
            for (const lexeme of this.lexer.lex(source, incomplete))
                yield* this.next(lexeme);
            if (!incomplete)
                yield* this.end();
        }
        /**
         * Advance the parser by the `source` of one lexical token.
         */
        *next(source) {
            this.source = source;
            if (this.atScalar) {
                this.atScalar = false;
                yield* this.step();
                this.offset += source.length;
                return;
            }
            const type = tokenType(source);
            if (!type) {
                const message = `Not a YAML token: ${source}`;
                yield* this.pop({ type: 'error', offset: this.offset, message, source });
                this.offset += source.length;
            }
            else if (type === 'scalar') {
                this.atNewLine = false;
                this.atScalar = true;
                this.type = 'scalar';
            }
            else {
                this.type = type;
                yield* this.step();
                switch (type) {
                    case 'newline':
                        this.atNewLine = true;
                        this.indent = 0;
                        if (this.onNewLine)
                            this.onNewLine(this.offset + source.length);
                        break;
                    case 'space':
                        if (this.atNewLine && source[0] === ' ')
                            this.indent += source.length;
                        break;
                    case 'explicit-key-ind':
                    case 'map-value-ind':
                    case 'seq-item-ind':
                        if (this.atNewLine)
                            this.indent += source.length;
                        break;
                    case 'doc-mode':
                        return;
                    default:
                        this.atNewLine = false;
                }
                this.offset += source.length;
            }
        }
        /** Call at end of input to push out any remaining constructions */
        *end() {
            while (this.stack.length > 0)
                yield* this.pop();
        }
        get sourceToken() {
            const st = {
                type: this.type,
                offset: this.offset,
                indent: this.indent,
                source: this.source
            };
            return st;
        }
        *step() {
            const top = this.peek(1);
            if (this.type === 'doc-end' && (!top || top.type !== 'doc-end')) {
                while (this.stack.length > 0)
                    yield* this.pop();
                this.stack.push({
                    type: 'doc-end',
                    offset: this.offset,
                    source: this.source
                });
                return;
            }
            if (!top)
                return yield* this.stream();
            switch (top.type) {
                case 'document':
                    return yield* this.document(top);
                case 'alias':
                case 'scalar':
                case 'single-quoted-scalar':
                case 'double-quoted-scalar':
                    return yield* this.scalar(top);
                case 'block-scalar':
                    return yield* this.blockScalar(top);
                case 'block-map':
                    return yield* this.blockMap(top);
                case 'block-seq':
                    return yield* this.blockSequence(top);
                case 'flow-collection':
                    return yield* this.flowCollection(top);
                case 'doc-end':
                    return yield* this.documentEnd(top);
            }
            /* istanbul ignore next should not happen */
            yield* this.pop();
        }
        peek(n) {
            return this.stack[this.stack.length - n];
        }
        *pop(error) {
            const token = error || this.stack.pop();
            /* istanbul ignore if should not happen */
            if (!token) {
                const message = 'Tried to pop an empty stack';
                yield { type: 'error', offset: this.offset, source: '', message };
            }
            else if (this.stack.length === 0) {
                yield token;
            }
            else {
                const top = this.peek(1);
                // For these, parent indent is needed instead of own
                if (token.type === 'block-scalar' || token.type === 'flow-collection')
                    token.indent = 'indent' in top ? top.indent : -1;
                if (token.type === 'flow-collection')
                    fixFlowSeqItems(token);
                switch (top.type) {
                    case 'document':
                        top.value = token;
                        break;
                    case 'block-scalar':
                        top.props.push(token); // error
                        break;
                    case 'block-map': {
                        const it = top.items[top.items.length - 1];
                        if (it.value) {
                            top.items.push({ start: [], key: token, sep: [] });
                            this.onKeyLine = true;
                            return;
                        }
                        else if (it.sep) {
                            it.value = token;
                        }
                        else {
                            Object.assign(it, { key: token, sep: [] });
                            this.onKeyLine = !includesToken(it.start, 'explicit-key-ind');
                            return;
                        }
                        break;
                    }
                    case 'block-seq': {
                        const it = top.items[top.items.length - 1];
                        if (it.value)
                            top.items.push({ start: [], value: token });
                        else
                            it.value = token;
                        break;
                    }
                    case 'flow-collection': {
                        const it = top.items[top.items.length - 1];
                        if (!it || it.value)
                            top.items.push({ start: [], key: token, sep: [] });
                        else if (it.sep)
                            it.value = token;
                        else
                            Object.assign(it, { key: token, sep: [] });
                        return;
                    }
                    /* istanbul ignore next should not happen */
                    default:
                        yield* this.pop();
                        yield* this.pop(token);
                }
                if ((top.type === 'document' ||
                    top.type === 'block-map' ||
                    top.type === 'block-seq') &&
                    (token.type === 'block-map' || token.type === 'block-seq')) {
                    const last = token.items[token.items.length - 1];
                    if (last &&
                        !last.sep &&
                        !last.value &&
                        last.start.length > 0 &&
                        !includesNonEmpty(last.start) &&
                        (token.indent === 0 ||
                            last.start.every(st => st.type !== 'comment' || st.indent < token.indent))) {
                        if (top.type === 'document')
                            top.end = last.start;
                        else
                            top.items.push({ start: last.start });
                        token.items.splice(-1, 1);
                    }
                }
            }
        }
        *stream() {
            switch (this.type) {
                case 'directive-line':
                    yield { type: 'directive', offset: this.offset, source: this.source };
                    return;
                case 'byte-order-mark':
                case 'space':
                case 'comment':
                case 'newline':
                    yield this.sourceToken;
                    return;
                case 'doc-mode':
                case 'doc-start': {
                    const doc = {
                        type: 'document',
                        offset: this.offset,
                        start: []
                    };
                    if (this.type === 'doc-start')
                        doc.start.push(this.sourceToken);
                    this.stack.push(doc);
                    return;
                }
            }
            yield {
                type: 'error',
                offset: this.offset,
                message: `Unexpected ${this.type} token in YAML stream`,
                source: this.source
            };
        }
        *document(doc) {
            if (doc.value)
                return yield* this.lineEnd(doc);
            switch (this.type) {
                case 'doc-start': {
                    if (includesNonEmpty(doc.start)) {
                        yield* this.pop();
                        yield* this.step();
                    }
                    else
                        doc.start.push(this.sourceToken);
                    return;
                }
                case 'anchor':
                case 'tag':
                case 'space':
                case 'comment':
                case 'newline':
                    doc.start.push(this.sourceToken);
                    return;
            }
            const bv = this.startBlockValue(doc);
            if (bv)
                this.stack.push(bv);
            else {
                yield {
                    type: 'error',
                    offset: this.offset,
                    message: `Unexpected ${this.type} token in YAML document`,
                    source: this.source
                };
            }
        }
        *scalar(scalar) {
            if (this.type === 'map-value-ind') {
                const prev = getPrevProps(this.peek(2));
                const start = getFirstKeyStartProps(prev);
                let sep;
                if (scalar.end) {
                    sep = scalar.end;
                    sep.push(this.sourceToken);
                    delete scalar.end;
                }
                else
                    sep = [this.sourceToken];
                const map = {
                    type: 'block-map',
                    offset: scalar.offset,
                    indent: scalar.indent,
                    items: [{ start, key: scalar, sep }]
                };
                this.onKeyLine = true;
                this.stack[this.stack.length - 1] = map;
            }
            else
                yield* this.lineEnd(scalar);
        }
        *blockScalar(scalar) {
            switch (this.type) {
                case 'space':
                case 'comment':
                case 'newline':
                    scalar.props.push(this.sourceToken);
                    return;
                case 'scalar':
                    scalar.source = this.source;
                    // block-scalar source includes trailing newline
                    this.atNewLine = true;
                    this.indent = 0;
                    if (this.onNewLine) {
                        let nl = this.source.indexOf('\n') + 1;
                        while (nl !== 0) {
                            this.onNewLine(this.offset + nl);
                            nl = this.source.indexOf('\n', nl) + 1;
                        }
                    }
                    yield* this.pop();
                    break;
                /* istanbul ignore next should not happen */
                default:
                    yield* this.pop();
                    yield* this.step();
            }
        }
        *blockMap(map) {
            var _a;
            const it = map.items[map.items.length - 1];
            // it.sep is true-ish if pair already has key or : separator
            switch (this.type) {
                case 'newline':
                    this.onKeyLine = false;
                    if (!it.sep && atFirstEmptyLineAfterComments(it.start)) {
                        const prev = map.items[map.items.length - 2];
                        const end = (_a = prev === null || prev === void 0 ? void 0 : prev.value) === null || _a === void 0 ? void 0 : _a.end;
                        if (Array.isArray(end)) {
                            Array.prototype.push.apply(end, it.start);
                            it.start = [this.sourceToken];
                            return;
                        }
                    }
                // fallthrough
                case 'space':
                case 'comment':
                    if (it.value)
                        map.items.push({ start: [this.sourceToken] });
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        it.start.push(this.sourceToken);
                    return;
            }
            if (this.indent >= map.indent) {
                const atNextItem = !this.onKeyLine &&
                    this.indent === map.indent &&
                    (it.sep || includesNonEmpty(it.start));
                switch (this.type) {
                    case 'anchor':
                    case 'tag':
                        if (atNextItem || it.value) {
                            map.items.push({ start: [this.sourceToken] });
                            this.onKeyLine = true;
                        }
                        else if (it.sep)
                            it.sep.push(this.sourceToken);
                        else
                            it.start.push(this.sourceToken);
                        return;
                    case 'explicit-key-ind':
                        if (!it.sep && !includesToken(it.start, 'explicit-key-ind'))
                            it.start.push(this.sourceToken);
                        else if (atNextItem || it.value)
                            map.items.push({ start: [this.sourceToken] });
                        else
                            this.stack.push({
                                type: 'block-map',
                                offset: this.offset,
                                indent: this.indent,
                                items: [{ start: [this.sourceToken] }]
                            });
                        this.onKeyLine = true;
                        return;
                    case 'map-value-ind':
                        if (!it.sep)
                            Object.assign(it, { key: null, sep: [this.sourceToken] });
                        else if (it.value ||
                            (atNextItem && !includesToken(it.start, 'explicit-key-ind')))
                            map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                        else if (includesToken(it.sep, 'map-value-ind'))
                            this.stack.push({
                                type: 'block-map',
                                offset: this.offset,
                                indent: this.indent,
                                items: [{ start: [], key: null, sep: [this.sourceToken] }]
                            });
                        else if (includesToken(it.start, 'explicit-key-ind') &&
                            isFlowToken(it.key) &&
                            !includesToken(it.sep, 'newline')) {
                            const start = getFirstKeyStartProps(it.start);
                            const key = it.key;
                            const sep = it.sep;
                            sep.push(this.sourceToken);
                            // @ts-ignore type guard is wrong here
                            delete it.key, delete it.sep;
                            this.stack.push({
                                type: 'block-map',
                                offset: this.offset,
                                indent: this.indent,
                                items: [{ start, key, sep }]
                            });
                        }
                        else
                            it.sep.push(this.sourceToken);
                        this.onKeyLine = true;
                        return;
                    case 'alias':
                    case 'scalar':
                    case 'single-quoted-scalar':
                    case 'double-quoted-scalar': {
                        const fs = this.flowScalar(this.type);
                        if (atNextItem || it.value) {
                            map.items.push({ start: [], key: fs, sep: [] });
                            this.onKeyLine = true;
                        }
                        else if (it.sep) {
                            this.stack.push(fs);
                        }
                        else {
                            Object.assign(it, { key: fs, sep: [] });
                            this.onKeyLine = true;
                        }
                        return;
                    }
                    default: {
                        const bv = this.startBlockValue(map);
                        if (bv) {
                            if (atNextItem &&
                                bv.type !== 'block-seq' &&
                                includesToken(it.start, 'explicit-key-ind'))
                                map.items.push({ start: [] });
                            this.stack.push(bv);
                            return;
                        }
                    }
                }
            }
            yield* this.pop();
            yield* this.step();
        }
        *blockSequence(seq) {
            var _a;
            const it = seq.items[seq.items.length - 1];
            switch (this.type) {
                case 'newline':
                    if (!it.value && atFirstEmptyLineAfterComments(it.start)) {
                        const prev = seq.items[seq.items.length - 2];
                        const end = (_a = prev === null || prev === void 0 ? void 0 : prev.value) === null || _a === void 0 ? void 0 : _a.end;
                        if (Array.isArray(end)) {
                            Array.prototype.push.apply(end, it.start);
                            it.start = [this.sourceToken];
                            return;
                        }
                    }
                // fallthrough
                case 'space':
                case 'comment':
                    if (it.value)
                        seq.items.push({ start: [this.sourceToken] });
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'anchor':
                case 'tag':
                    if (it.value || this.indent <= seq.indent)
                        break;
                    it.start.push(this.sourceToken);
                    return;
                case 'seq-item-ind':
                    if (this.indent !== seq.indent)
                        break;
                    if (it.value || includesToken(it.start, 'seq-item-ind'))
                        seq.items.push({ start: [this.sourceToken] });
                    else
                        it.start.push(this.sourceToken);
                    return;
            }
            if (this.indent > seq.indent) {
                const bv = this.startBlockValue(seq);
                if (bv) {
                    this.stack.push(bv);
                    return;
                }
            }
            yield* this.pop();
            yield* this.step();
        }
        *flowCollection(fc) {
            const it = fc.items[fc.items.length - 1];
            if (this.type === 'flow-error-end') {
                let top;
                do {
                    yield* this.pop();
                    top = this.peek(1);
                } while (top && top.type === 'flow-collection');
            }
            else if (fc.end.length === 0) {
                switch (this.type) {
                    case 'comma':
                    case 'explicit-key-ind':
                        if (!it || it.sep)
                            fc.items.push({ start: [this.sourceToken] });
                        else
                            it.start.push(this.sourceToken);
                        return;
                    case 'map-value-ind':
                        if (!it || it.value)
                            fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
                        else if (it.sep)
                            it.sep.push(this.sourceToken);
                        else
                            Object.assign(it, { key: null, sep: [this.sourceToken] });
                        return;
                    case 'space':
                    case 'comment':
                    case 'newline':
                    case 'anchor':
                    case 'tag':
                        if (!it || it.value)
                            fc.items.push({ start: [this.sourceToken] });
                        else if (it.sep)
                            it.sep.push(this.sourceToken);
                        else
                            it.start.push(this.sourceToken);
                        return;
                    case 'alias':
                    case 'scalar':
                    case 'single-quoted-scalar':
                    case 'double-quoted-scalar': {
                        const fs = this.flowScalar(this.type);
                        if (!it || it.value)
                            fc.items.push({ start: [], key: fs, sep: [] });
                        else if (it.sep)
                            this.stack.push(fs);
                        else
                            Object.assign(it, { key: fs, sep: [] });
                        return;
                    }
                    case 'flow-map-end':
                    case 'flow-seq-end':
                        fc.end.push(this.sourceToken);
                        return;
                }
                const bv = this.startBlockValue(fc);
                /* istanbul ignore else should not happen */
                if (bv)
                    this.stack.push(bv);
                else {
                    yield* this.pop();
                    yield* this.step();
                }
            }
            else {
                const parent = this.peek(2);
                if (parent.type === 'block-map' &&
                    (this.type === 'map-value-ind' ||
                        (this.type === 'newline' &&
                            !parent.items[parent.items.length - 1].sep))) {
                    yield* this.pop();
                    yield* this.step();
                }
                else if (this.type === 'map-value-ind' &&
                    parent.type !== 'flow-collection') {
                    const prev = getPrevProps(parent);
                    const start = getFirstKeyStartProps(prev);
                    fixFlowSeqItems(fc);
                    const sep = fc.end.splice(1, fc.end.length);
                    sep.push(this.sourceToken);
                    const map = {
                        type: 'block-map',
                        offset: fc.offset,
                        indent: fc.indent,
                        items: [{ start, key: fc, sep }]
                    };
                    this.onKeyLine = true;
                    this.stack[this.stack.length - 1] = map;
                }
                else {
                    yield* this.lineEnd(fc);
                }
            }
        }
        flowScalar(type) {
            if (this.onNewLine) {
                let nl = this.source.indexOf('\n') + 1;
                while (nl !== 0) {
                    this.onNewLine(this.offset + nl);
                    nl = this.source.indexOf('\n', nl) + 1;
                }
            }
            return {
                type,
                offset: this.offset,
                indent: this.indent,
                source: this.source
            };
        }
        startBlockValue(parent) {
            switch (this.type) {
                case 'alias':
                case 'scalar':
                case 'single-quoted-scalar':
                case 'double-quoted-scalar':
                    return this.flowScalar(this.type);
                case 'block-scalar-header':
                    return {
                        type: 'block-scalar',
                        offset: this.offset,
                        indent: this.indent,
                        props: [this.sourceToken],
                        source: ''
                    };
                case 'flow-map-start':
                case 'flow-seq-start':
                    return {
                        type: 'flow-collection',
                        offset: this.offset,
                        indent: this.indent,
                        start: this.sourceToken,
                        items: [],
                        end: []
                    };
                case 'seq-item-ind':
                    return {
                        type: 'block-seq',
                        offset: this.offset,
                        indent: this.indent,
                        items: [{ start: [this.sourceToken] }]
                    };
                case 'explicit-key-ind': {
                    this.onKeyLine = true;
                    const prev = getPrevProps(parent);
                    const start = getFirstKeyStartProps(prev);
                    start.push(this.sourceToken);
                    return {
                        type: 'block-map',
                        offset: this.offset,
                        indent: this.indent,
                        items: [{ start }]
                    };
                }
                case 'map-value-ind': {
                    this.onKeyLine = true;
                    const prev = getPrevProps(parent);
                    const start = getFirstKeyStartProps(prev);
                    return {
                        type: 'block-map',
                        offset: this.offset,
                        indent: this.indent,
                        items: [{ start, key: null, sep: [this.sourceToken] }]
                    };
                }
            }
            return null;
        }
        *documentEnd(docEnd) {
            if (this.type !== 'doc-mode') {
                if (docEnd.end)
                    docEnd.end.push(this.sourceToken);
                else
                    docEnd.end = [this.sourceToken];
                if (this.type === 'newline')
                    yield* this.pop();
            }
        }
        *lineEnd(token) {
            switch (this.type) {
                case 'comma':
                case 'doc-start':
                case 'doc-end':
                case 'flow-seq-end':
                case 'flow-map-end':
                case 'map-value-ind':
                    yield* this.pop();
                    yield* this.step();
                    break;
                case 'newline':
                    this.onKeyLine = false;
                // fallthrough
                case 'space':
                case 'comment':
                default:
                    // all other values are errors
                    if (token.end)
                        token.end.push(this.sourceToken);
                    else
                        token.end = [this.sourceToken];
                    if (this.type === 'newline')
                        yield* this.pop();
            }
        }
    }

    function parseOptions$1(options) {
        const prettyErrors = !options || options.prettyErrors !== false;
        const lineCounter = (options && options.lineCounter) ||
            (prettyErrors && new LineCounter()) ||
            null;
        return { lineCounter, prettyErrors };
    }
    /** Parse an input string into a single YAML.Document */
    function parseDocument(source, options = {}) {
        const { lineCounter, prettyErrors } = parseOptions$1(options);
        const parser = new Parser(lineCounter === null || lineCounter === void 0 ? void 0 : lineCounter.addNewLine);
        const composer = new Composer(options);
        // `doc` is always set by compose.end(true) at the very latest
        let doc = null;
        for (const _doc of composer.compose(parser.parse(source), true, source.length)) {
            if (!doc)
                doc = _doc;
            else if (doc.options.logLevel !== 'silent') {
                doc.errors.push(new YAMLParseError(_doc.range.slice(0, 2), 'MULTIPLE_DOCS', 'Source contains multiple documents; please use YAML.parseAllDocuments()'));
                break;
            }
        }
        if (prettyErrors && lineCounter) {
            doc.errors.forEach(prettifyError(source, lineCounter));
            doc.warnings.forEach(prettifyError(source, lineCounter));
        }
        return doc;
    }
    function parse(src, reviver, options) {
        let _reviver = undefined;
        if (typeof reviver === 'function') {
            _reviver = reviver;
        }
        else if (options === undefined && reviver && typeof reviver === 'object') {
            options = reviver;
        }
        const doc = parseDocument(src, options);
        if (!doc)
            return null;
        doc.warnings.forEach(warning => warn(doc.options.logLevel, warning));
        if (doc.errors.length > 0) {
            if (doc.options.logLevel !== 'silent')
                throw doc.errors[0];
            else
                doc.errors = [];
        }
        return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }

    // customize tokenizer to include yaml like header blocks
    const tokenizer = {
        // type definition does no allow custom token type
        // @ts-ignore
        hr(src) {
            //adapted from https://github.com/markedjs/marked/blob/master/src/rules.js
            const regex = RegExp(/^ {0,3}(-{3,}(?=[^-\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~-]* *(?:\n+|$)|$)/);
            const cap = regex.exec(src);
            if (cap) {
                return {
                    type: 'options',
                    raw: cap[0],
                    data: parse(cap[3], {}),
                };
            }
        },
    };
    // customize renderer
    const renderer = {
        // disable paragraph
        paragraph(text) {
            return text;
        },
        //disable blockquote, we use this for hints
        blockquote(text) {
            return text;
        },
        //disable heading, we only use h3 headings
        heading(text) {
            return text;
        },
    };
    marked_1.use({
        renderer: renderer,
        // type definition does not allow custom token type
        // @ts-ignore
        tokenizer: tokenizer,
    });

    function parseQuizdown(rawQuizdown, globalConfig) {
        let tokens = tokenize(rawQuizdown);
        // globalConfig < quizConfig < questionConfig
        let quizConfig = new Config(globalConfig);
        if (hasQuizOptions(tokens)) {
            quizConfig = parseOptions(tokens, quizConfig);
        }
        let firstHeadingIdx = findFirstHeadingIdx(tokens);
        let questions = extractQuestions(tokens.slice(firstHeadingIdx), quizConfig);
        return new Quiz(questions, quizConfig);
    }
    function tokenize(rawQuizdown) {
        return marked_1.lexer(htmlDecode(stripIndent(rawQuizdown)));
    }
    function hasQuizOptions(tokens) {
        // type definition does not allow custom token types
        // @ts-ignore
        let optionsIdx = tokens.findIndex((token) => token['type'] == 'options');
        let headingIdx = tokens.findIndex((token) => token['type'] == 'heading');
        // quiz options appear at the top before the first heading
        return optionsIdx !== -1 && headingIdx > optionsIdx;
    }
    function parseOptions(tokens, quizConfig) {
        // type definition does not allow custom token types
        // @ts-ignore
        let options = tokens.find((token) => token.type == 'options');
        return mergeAttributes(quizConfig, options['data']);
    }
    function extractQuestions(tokens, config) {
        let questions = [];
        let nextQuestion = 0;
        while (tokens.length !== 0) {
            nextQuestion = findFirstHeadingIdx(tokens.slice(1));
            if (nextQuestion === -1) {
                // no next question on last question
                nextQuestion = tokens.length;
            }
            let question = parseQuestion(tokens.splice(0, nextQuestion + 1), config);
            questions.push(question);
        }
        return questions;
    }
    function parseQuestion(tokens, config) {
        let explanation = parseExplanation(tokens);
        let hint = parseHint(tokens);
        let heading = parseHeading(tokens);
        let answers = parseAnswers(tokens);
        let questionType = determineQuestionType(tokens);
        let questionConfig = new Config(config);
        const args = [heading, explanation, hint, answers, questionConfig];
        switch (questionType) {
            case 'SingleChoice':
                return new SingleChoice(...args);
            case 'MultipleChoice':
                return new MultipleChoice(...args);
            case 'Sequence':
                return new Sequence(...args);
        }
    }
    function findFirstHeadingIdx(tokens) {
        return tokens.findIndex((token) => token['type'] == 'heading');
    }
    function parseHint(tokens) {
        let blockquotes = tokens.filter((token) => token['type'] == 'blockquote');
        return parseTokens(blockquotes);
    }
    function parseExplanation(tokens) {
        let explanations = tokens.filter((token) => token['type'] == 'paragraph' || token['type'] == 'code');
        return parseTokens(explanations);
    }
    function parseHeading(tokens) {
        let headings = tokens.filter((token) => token['type'] == 'heading');
        return parseTokens(headings);
    }
    function parseAnswers(tokens) {
        let list = tokens.find((token) => token.type == 'list');
        let answers = [];
        list.items.forEach(function (item, i) {
            let answer = parseAnswer(item);
            answers.push(new Answer(i, answer['text'], item['checked'], answer['comment']));
        });
        return answers;
    }
    function parseAnswer(item) {
        let comments = item['tokens'].filter((token) => token.type == 'blockquote');
        let texts = item['tokens'].filter((token) => token.type != 'blockquote');
        return { text: parseTokens(texts), comment: parseTokens(comments) };
    }
    function determineQuestionType(tokens) {
        let list = tokens.find((token) => token.type == 'list');
        if (list.ordered) {
            if (list.items[0].task) {
                return 'SingleChoice';
            }
            else {
                return 'Sequence';
            }
        }
        else {
            return 'MultipleChoice';
        }
    }
    function parseTokens(tokens) {
        return purify.sanitize(marked_1.parser(tokens));
    }
    function htmlDecode(text) {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }

    function register(extension) {
        extension.setup(this);
        return this;
    }
    function createApp(rawQuizdown, node, config) {
        node.innerHTML = '';
        let root;
        if (!!node.shadowRoot) {
            //clear root if it already exists
            root = node.shadowRoot;
            root.innerHTML = '';
        }
        else {
            root = node.attachShadow({ mode: 'open' });
        }
        try {
            let quiz = parseQuizdown(rawQuizdown, config);
            let app = new App({
                // https://github.com/sveltejs/svelte/pull/5870
                target: root,
                intro: false,
                props: {
                    quiz: quiz,
                },
            });
            return app;
        }
        catch (e) {
            root.innerHTML = `${e}. App could not render. Please check your quizdown syntax.`;
        }
    }
    function init(config = {}) {
        let globalConfig = new Config(config);
        if (globalConfig.startOnLoad) {
            if (typeof document !== 'undefined') {
                window.addEventListener('load', function () {
                    let nodes = document.querySelectorAll('.quizdown');
                    for (let node of nodes) {
                        createApp(node.innerHTML, node, globalConfig);
                    }
                }, false);
            }
        }
    }
    function getMarkedParser() {
        return marked_1;
    }
    let quizdown = {
        init,
        register,
        parseQuizdown,
        createApp,
        getMarkedParser,
    };

    return quizdown;

})));
//# sourceMappingURL=quizdown.js.map
