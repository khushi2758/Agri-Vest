import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarWidget() {
  return (
    <div>
      <div className="bg-[#fafafa] rounded-[24px] p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-gray-900 text-sm">May 2023</span>
          <div className="flex gap-2 text-gray-500">
            <ChevronLeft size={16} />
            <ChevronRight size={16} />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold mb-3 text-gray-400">
          <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
        </div>
        <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-xs font-bold text-gray-900">
          <div className="text-gray-300">29</div><div className="text-gray-300">30</div><div className="text-gray-300">31</div>
          <div>1</div><div>2</div><div>3</div><div>4</div>
          <div className="bg-[#aed581] text-white w-7 h-7 flex items-center justify-center rounded-full mx-auto">5</div>
          <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div>
          <div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
          <div>19</div><div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div>
          <div>26</div><div>27</div><div>28</div><div>29</div><div>30</div><div className="text-gray-300">1</div><div className="text-gray-300">2</div>
        </div>
      </div>
    </div>
  );
}
